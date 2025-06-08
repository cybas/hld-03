
export const formatAIResponse = (text: string): string => {
  // Minimal processing, relying on Bedrock for primary markdown formatting.
  // Only trim whitespace and normalize multiple spaces/newlines that might affect layout.
  let formattedText = text.trim();
  
  // Normalize multiple spaces to a single space - this helps if Bedrock has odd spacing.
  // It should not affect intentional markdown spacing like code blocks if Bedrock sends them.
  formattedText = formattedText.replace(/ +/g, ' ');

  // Normalize multiple consecutive newlines into a standard double newline.
  // This can help ensure consistent paragraph spacing if `whitespace-pre-line` is used,
  // or if newlines are later converted to <br><br>.
  // For now, with \n -> <br> conversion in bubble, this might be less critical
  // but good for general cleanup.
  formattedText = formattedText.replace(/\n\s*\n/g, '\n\n');
  
  return formattedText;
};
