
export const formatAIResponse = (text: string): string => {
  if (!text) return ''; // Handle null or undefined input

  let formattedText = text;

  // Remove excessive asterisks and clean up formatting
  // Keep valid **bold** formatting, remove stray single asterisks if they are not part of a list item
  formattedText = formattedText.replace(/\*([^* \n](?:[^*]*[^* \n])?)\*/g, '$1'); // Remove single asterisks used for emphasis if not list items

  // Format section headers like **Header:** by ensuring newlines around them
  // This regex looks for **Text:** and adds newlines if not already present effectively
  formattedText = formattedText.replace(/\s*\*\*([^:]+):\*\*\s*/g, '\n\n**$1:**\n');

  // Convert dash lists and asterisk lists to bullet points (•)
  // Handle lists that might or might not have a space after the dash/asterisk
  formattedText = formattedText.replace(/^[ \t]*-\s?/gm, '• ');
  formattedText = formattedText.replace(/\n[ \t]*-\s?/gm, '\n• ');
  formattedText = formattedText.replace(/^[ \t]*\*\s?/gm, '• '); // For asterisk list items
  formattedText = formattedText.replace(/\n[ \t]*\*\s?/gm, '\n• '); // For asterisk list items
  
  // Ensure proper line breaks before section headers that might follow a sentence.
  formattedText = formattedText.replace(/([.!?])\s*(\*\*[^:]+:\*\*)/g, '$1\n\n$2');

  // Clean up multiple line breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing spaces on each line, then trim the whole string
  formattedText = formattedText.split('\n').map(line => line.trim()).join('\n').trim();
  
  // Normalize multiple spaces within lines to a single space (but not spaces at the start of a line for bullets)
  formattedText = formattedText.replace(/ (?= )/g, '');


  // Specific rule provided in prompt: .replace(/\+\+([^+]+)\+\+/g, '\n• **$1**')
  // This seems to be for a custom "++highlighted bullet++" syntax.
  formattedText = formattedText.replace(/\+\+([^+]+)\+\+/g, '\n• **$1**');

  // Specific rule provided: .replace(/(\d+\.\s)/g, '\n$1') - Ensure newline before numbered list items
  // This helps separate numbered list items onto new lines if they aren't already.
  formattedText = formattedText.replace(/(\d+\.\s)/g, '\n$1');
  
  // Specific rule provided: .replace(/([•·])/g, '\n$1') - Ensure newline before bullet characters if they are run-on
  // This helps separate bullet points onto new lines if they aren't already.
  formattedText = formattedText.replace(/([•·])/g, '\n$1');

  // Re-trim and clean multiple newlines after specific list formatting rules
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n').trim();

  return formattedText;
};
