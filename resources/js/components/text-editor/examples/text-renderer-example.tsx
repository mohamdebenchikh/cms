import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TextRenderer } from "../text-renderer";

/**
 * Example component demonstrating how to use the TextRenderer
 */
export function TextRendererExample() {
  // Example content that might come from your database or API
  const exampleContent = `
    <h1>This is a heading</h1>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <p>You can also include <a href="#">links</a> and other formatting.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
    <blockquote>
      <p>This is a blockquote that might contain a notable quote or excerpt.</p>
    </blockquote>
    <p>You can also include code snippets:</p>
    <pre><code>const greeting = "Hello, world!";</code></pre>
  `;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Preview</CardTitle>
        <CardDescription>
          This is how your content will appear to readers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TextRenderer content={exampleContent} />
      </CardContent>
    </Card>
  );
}
