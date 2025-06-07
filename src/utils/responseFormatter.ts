
export const formatAIResponse = (text: string): string => {
  // The user's provided regex aims to:
  // 1. Remove double asterisks (likely for bold) and single asterisks.
  // 2. Convert hyphenated list items "- item" to bulleted "• item".
  // 3. Attempt to ensure numbered lists and bullet points start on new lines.
  // 4. Convert a custom "++item++" syntax to a new line, bulleted, and bolded item.
  // 5. Clean up spacing and multiple newlines.

  // Note: If Bedrock sends HTML (e.g., <strong> for bold), that will be handled by dangerouslySetInnerHTML in MessageBubble.
  // This function's ** output for bold relies on how MessageBubble handles it, or if Bedrock itself interprets it.
  // Given previous instructions, MessageBubble currently doesn't convert ** to <strong>.

  let formattedText = text;

  // Remove all asterisks first as they might interfere with other rules or are just for cleanup
  formattedText = formattedText.replace(/\*\*/g, '').replace(/\*/g, '');

  // Convert "- item" to "• item"
  formattedText = formattedText.replace(/^- ([^\n]+)/gm, '• $1');

  // Standardize list markers to start on a new line if they don't already seem to be part of one.
  // This is tricky without more context on input. Let's be conservative.
  // If a line starts with a number. or a bullet, ensure it's on its own line.
  // This tries to avoid adding too many newlines if already formatted.
  formattedText = formattedText.replace(/(\n\s*)?(\d+\.\s)/g, '\n$2'); // Numbered lists
  formattedText = formattedText.replace(/(\n\s*)?([•·-])/g, '\n$2'); // Bullet points (including hyphens if not caught above)

  // Convert "++item++" to a new line, bulleted, and bolded item.
  // Since we removed ** earlier, we'll use <strong> for direct HTML rendering
  formattedText = formattedText.replace(/\+\+([^+]+)\+\+/g, '\n• <strong>$1</strong>');

  // General cleanup
  formattedText = formattedText.replace(/\s+/g, ' '); // Collapse multiple spaces
  formattedText = formattedText.replace(/\n\s+/g, '\n'); // Remove leading spaces from new lines
  formattedText = formattedText.replace(/\n\n\n+/g, '\n\n'); // Collapse multiple new lines (max 2)
  
  return formattedText.trim();
};
