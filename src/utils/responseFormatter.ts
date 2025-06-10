export const formatAIResponse = (text: string): string => {
  if (!text) return '';

  let formattedText = text;

  // Remove excessive asterisks but preserve **bold** formatting
  formattedText = formattedText.replace(/\*\*\*/g, '**'); // Triple asterisks to double

  // Convert **bold** to HTML <strong> tags (better than <b> for semantics)
  formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Remove any remaining single asterisks
  formattedText = formattedText.replace(/(?<!\*)\*(?!\*)/g, '');

  // Format section headers with proper spacing (they're now <strong> tags)
  formattedText = formattedText.replace(/<strong>([^:]+):<\/strong>/g, '\n\n<strong>$1:</strong>\n');

  // SMART BULLET POINT CONVERSION - Only convert when it's actually a list
  const lines = formattedText.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    
    // Check if this looks like a real list item
    if (currentLine.match(/^[-*]\s+/)) {
      // Only convert to bullet if it's a real list
      const isRealList = 
        nextLine.match(/^[-*]\s+/) || 
        prevLine.match(/^[-*]\s+/) || 
        prevLine.endsWith(':') ||
        prevLine.includes('<strong>') && prevLine.endsWith('</strong>');
        
      if (isRealList) {
        processedLines.push(currentLine.replace(/^[-*]\s*/, '• '));
      } else {
        // Not a real list, remove the dash/asterisk
        processedLines.push(currentLine.replace(/^[-*]\s*/, ''));
      }
    } else {
      processedLines.push(lines[i]);
    }
  }
  
  formattedText = processedLines.join('\n');

  // Handle numbered lists properly
  formattedText = formattedText.replace(/^(\d+\.)\s+/gm, '\n$1 ');

  // Clean up spacing
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  formattedText = formattedText.replace(/^\n+/, '');
  formattedText = formattedText.replace(/\n+$/, '');
  formattedText = formattedText.replace(/ {2,}/g, ' ');

  return formattedText.trim();
};