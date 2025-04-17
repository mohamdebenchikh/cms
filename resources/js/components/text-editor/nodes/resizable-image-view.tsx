import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

// Inline styles for resizable image
const styles = {
  resizeContainer: {
    position: 'relative',
    display: 'inline-block',
    margin: '1rem 0',
  },
  resizableImageWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  resizableImageWrapperResizing: {
    position: 'relative',
    display: 'inline-block',
  },
  resizableImage: {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  },
  resizeHandle: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    border: '2px solid #3b82f6',
    borderRadius: '50%',
    zIndex: 10,
    display: 'block', // Ensure the handle is visible
  },
  topLeft: {
    top: '-6px',
    left: '-6px',
    cursor: 'nwse-resize',
  },
  topRight: {
    top: '-6px',
    right: '-6px',
    cursor: 'nesw-resize',
  },
  bottomLeft: {
    bottom: '-6px',
    left: '-6px',
    cursor: 'nesw-resize',
  },
  bottomRight: {
    bottom: '-6px',
    right: '-6px',
    cursor: 'nwse-resize',
  },
};

interface ResizeControlsProps {
  onResize: (width: number, height: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

const ResizeControls: React.FC<ResizeControlsProps> = ({
  onResize,
  onResizeStart,
  onResizeEnd,
  containerRef,
}) => {
  const startWidth = useRef<number>(0);
  const startHeight = useRef<number>(0);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const parent = useRef<HTMLElement | null>(null);
  const aspectRatio = useRef<number>(1);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, corner: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Use containerRef if available, otherwise fall back to parent.current
      const container = containerRef?.current || parent.current;
      if (!container) return;

      const img = container.querySelector('img');
      if (!img) return;

      // Store initial dimensions and position
      startWidth.current = img.offsetWidth;
      startHeight.current = img.offsetHeight;
      startX.current = e.clientX;
      startY.current = e.clientY;
      aspectRatio.current = startWidth.current / startHeight.current;

      onResizeStart();

      // Add event listeners for resize
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        // Calculate the delta movement
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;

        let newWidth = startWidth.current;
        let newHeight = startHeight.current;

        // Adjust dimensions based on which corner is being dragged
        switch (corner) {
          case 'bottom-right':
            newWidth = startWidth.current + dx;
            newHeight = startHeight.current + dy;
            break;
          case 'bottom-left':
            newWidth = startWidth.current - dx;
            newHeight = startHeight.current + dy;
            break;
          case 'top-right':
            newWidth = startWidth.current + dx;
            newHeight = startHeight.current - dy;
            break;
          case 'top-left':
            newWidth = startWidth.current - dx;
            newHeight = startHeight.current - dy;
            break;
        }

        // Ensure minimum dimensions
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);

        // Apply the new dimensions
        onResize(newWidth, newHeight);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        onResizeEnd();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResize, onResizeStart, onResizeEnd]
  );

  useEffect(() => {
    // Find the parent element
    if (typeof document !== 'undefined') {
      // Use a more reliable way to get the parent element
      const resizeHandles = document.querySelectorAll('[data-resize-handle="true"]');
      if (resizeHandles.length > 0) {
        const handle = resizeHandles[0];
        parent.current = handle.parentElement;
      }
    }
  }, []);

  return (
    <>
      <div
        style={{...styles.resizeHandle, ...styles.topLeft}}
        onMouseDown={(e) => handleMouseDown(e, 'top-left')}
        data-resize-handle="true"
      />
      <div
        style={{...styles.resizeHandle, ...styles.topRight}}
        onMouseDown={(e) => handleMouseDown(e, 'top-right')}
      />
      <div
        style={{...styles.resizeHandle, ...styles.bottomLeft}}
        onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
      />
      <div
        style={{...styles.resizeHandle, ...styles.bottomRight}}
        onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
      />
    </>
  );
};

export const ResizableImageView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(
    (width: number, height: number) => {
      if (imageRef.current) {
        // Update the image dimensions
        imageRef.current.style.width = `${width}px`;
        imageRef.current.style.height = `${height}px`;
      }
    },
    []
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);

    if (imageRef.current) {
      // Get the final dimensions
      const width = imageRef.current.offsetWidth;
      const height = imageRef.current.offsetHeight;

      // Update the node attributes
      updateAttributes({
        width: width,
        height: height,
      });
    }
  }, [updateAttributes]);

  return (
    <NodeViewWrapper style={styles.resizeContainer}>
      <div
        ref={containerRef}
        style={isResizing ? styles.resizableImageWrapperResizing : styles.resizableImageWrapper}>
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          title={node.attrs.title}
          width={node.attrs.width}
          height={node.attrs.height}
          style={{
            ...styles.resizableImage,
            outline: isResizing ? '2px solid #3b82f6' : 'none',
          }}
          onMouseOver={() => {
            if (imageRef.current) {
              imageRef.current.style.outline = '2px solid rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseOut={() => {
            if (imageRef.current && !isResizing) {
              imageRef.current.style.outline = 'none';
            }
          }}
        />
        {/* Only show resize controls when hovering or resizing */}
        <ResizeControls
          onResize={handleResize}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={handleResizeEnd}
          containerRef={containerRef}
        />
      </div>
    </NodeViewWrapper>
  );
};
