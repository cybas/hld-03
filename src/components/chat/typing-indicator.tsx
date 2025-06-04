export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-2">
      <div className="h-2 w-2 animate-dot-pulse-before rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-dot-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-dot-pulse-after rounded-full bg-muted-foreground"></div>
    </div>
  );
}
