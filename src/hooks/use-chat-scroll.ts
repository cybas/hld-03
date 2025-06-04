import React, { useEffect, useRef } from 'react';

function useChatScroll<T>(dep: T): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      // Timeout to allow DOM to update before scrolling
      setTimeout(() => {
        if (ref.current) {
         ref.current.scrollTop = ref.current.scrollHeight;
        }
      }, 0);
    }
  }, [dep]);
  return ref;
}

export default useChatScroll;
