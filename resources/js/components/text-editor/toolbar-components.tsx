import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Type,
  ListChecks,
  MoreHorizontal,
  Superscript,
  Subscript,
  RemoveFormatting,
  PilcrowSquare,
  Table,
  Indent,
  Outdent,
  WrapText,
  Highlighter,
  TextQuote,
  Eraser,
  Baseline,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarButtonProps {
  editor: Editor;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function ToolbarButton({ editor, isActive, onClick, icon, label }: ToolbarButtonProps) {
  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={onClick}
      aria-label={label}
      className="rounded-md h-8 w-8"
    >
      {icon}
    </Toggle>
  );
}

export function BasicFormatButtons({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <div className="flex items-center">
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="h-4 w-4" />}
        label="Bold"
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="h-4 w-4" />}
        label="Italic"
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough className="h-4 w-4" />}
        label="Strikethrough"
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Code className="h-4 w-4" />}
        label="Code"
      />
    </div>
  );
}

export function HeadingDropdown({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const isHeadingActive = editor.isActive('heading', { level: 1 }) ||
                          editor.isActive('heading', { level: 2 }) ||
                          editor.isActive('heading', { level: 3 });

  const getActiveHeadingText = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'Text';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2 text-xs rounded-md",
            isHeadingActive && "bg-accent text-accent-foreground"
          )}
        >
          <Type className="h-4 w-4" />
          <span>{getActiveHeadingText()}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "flex items-center gap-2",
              !isHeadingActive && "bg-accent/50"
            )}
          >
            <span className="text-xs">Normal Text</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('heading', { level: 1 }) && "bg-accent/50"
            )}
          >
            <Heading1 className="h-4 w-4" />
            <span className="text-xs">Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('heading', { level: 2 }) && "bg-accent/50"
            )}
          >
            <Heading2 className="h-4 w-4" />
            <span className="text-xs">Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('heading', { level: 3 }) && "bg-accent/50"
            )}
          >
            <Heading3 className="h-4 w-4" />
            <span className="text-xs">Heading 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ListDropdown({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const isListActive = editor.isActive('bulletList') ||
                       editor.isActive('orderedList') ||
                       editor.isActive('blockquote');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1 px-2 text-xs rounded-md",
            isListActive && "bg-accent text-accent-foreground"
          )}
        >
          <ListChecks className="h-4 w-4" />
          <span>List</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('bulletList') && "bg-accent/50"
            )}
          >
            <List className="h-4 w-4" />
            <span className="text-xs">Bullet List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('orderedList') && "bg-accent/50"
            )}
          >
            <ListOrdered className="h-4 w-4" />
            <span className="text-xs">Numbered List</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MoreFeaturesDropdown({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs rounded-md"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span>More</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('superscript') && "bg-accent/50"
            )}
          >
            <Superscript className="h-4 w-4" />
            <span className="text-xs">Superscript</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('subscript') && "bg-accent/50"
            )}
          >
            <Subscript className="h-4 w-4" />
            <span className="text-xs">Subscript</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('highlight') && "bg-accent/50"
            )}
          >
            <Highlighter className="h-4 w-4" />
            <span className="text-xs">Highlight</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive('underline') && "bg-accent/50"
            )}
          >
            <Underline className="h-4 w-4" />
            <span className="text-xs">Underline</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator className="my-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="flex items-center gap-2"
          >
            <Baseline className="h-4 w-4" />
            <span className="text-xs">Horizontal Rule</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setHardBreak().run()}
            className="flex items-center gap-2"
          >
            <PilcrowSquare className="h-4 w-4" />
            <span className="text-xs">Hard Break</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator className="my-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="flex items-center gap-2"
          >
            <RemoveFormatting className="h-4 w-4" />
            <span className="text-xs">Clear Formatting</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="flex items-center gap-2"
          >
            <Eraser className="h-4 w-4" />
            <span className="text-xs">Clear Nodes</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AlignmentDropdown({ editor }: { editor: Editor }) {
  if (!editor) return null;

  const getActiveAlignment = () => {
    if (editor.isActive({ textAlign: 'left' })) return 'left';
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    if (editor.isActive({ textAlign: 'justify' })) return 'justify';
    return 'left';
  };

  const activeAlignment = getActiveAlignment();

  const getAlignmentIcon = () => {
    switch (activeAlignment) {
      case 'center': return <AlignCenter className="h-4 w-4" />;
      case 'right': return <AlignRight className="h-4 w-4" />;
      case 'justify': return <AlignJustify className="h-4 w-4" />;
      default: return <AlignLeft className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs rounded-md"
        >
          {getAlignmentIcon()}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              "flex items-center gap-2",
              activeAlignment === 'left' && "bg-accent/50"
            )}
          >
            <AlignLeft className="h-4 w-4" />
            <span className="text-xs">Align Left</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              "flex items-center gap-2",
              activeAlignment === 'center' && "bg-accent/50"
            )}
          >
            <AlignCenter className="h-4 w-4" />
            <span className="text-xs">Align Center</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              "flex items-center gap-2",
              activeAlignment === 'right' && "bg-accent/50"
            )}
          >
            <AlignRight className="h-4 w-4" />
            <span className="text-xs">Align Right</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn(
              "flex items-center gap-2",
              activeAlignment === 'justify' && "bg-accent/50"
            )}
          >
            <AlignJustify className="h-4 w-4" />
            <span className="text-xs">Justify</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
