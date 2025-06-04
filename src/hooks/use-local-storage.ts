
import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state with initialValue directly.
  // This ensures that the server render and the first client render pass use the same value.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // useEffect to load the value from localStorage only on the client, after hydration.
  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Only update if the parsed item is different from the current storedValue
        // to avoid unnecessary re-renders if initialValue was already correct.
        const parsedItem = JSON.parse(item) as T;
        // Basic check for primitive types or if stringified versions differ for objects/arrays
        // For complex objects, a deep equality check might be better but can be expensive.
        if (JSON.stringify(storedValue) !== JSON.stringify(parsedItem)) {
            setStoredValue(parsedItem);
        }
      }
      // If item is null, storedValue remains initialValue (or what it was), which is correct.
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      // In case of an error, storedValue remains as is (likely initialValue).
    }
  // Only re-run if the key changes. storedValue is not needed as a dep here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a client`
        );
        return;
      }
      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(newValue);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(newValue));
        // We dispatch a custom event so other instances of the hook are notified
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key, storedValue] // Ensure storedValue is a dependency for the callback updater function
  );

  // Effect for handling external storage changes (e.g., other tabs or our own 'local-storage' event)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageEvents = (event?: StorageEvent) => {
      // For 'storage' event, check if it's for our key.
      // For 'local-storage' custom event, event might be undefined or not a StorageEvent.
      if (event && event instanceof StorageEvent && event.key !== key) {
        return;
      }

      try {
        const item = window.localStorage.getItem(key);
        const newValue = item ? (JSON.parse(item) as T) : initialValue;
        
        // Only update if the value actually changed to prevent potential loops
        if (JSON.stringify(storedValue) !== JSON.stringify(newValue)) {
            setStoredValue(newValue);
        }
      } catch (error) {
        console.warn(`Error handling storage event for key “${key}”:`, error);
        setStoredValue(initialValue);
      }
    };
    
    window.addEventListener('storage', handleStorageEvents as EventListener); // Standard browser event for other tabs
    window.addEventListener('local-storage', handleStorageEvents as EventListener); // Custom event for same-tab updates by setValue

    return () => {
      window.removeEventListener('storage', handleStorageEvents as EventListener);
      window.removeEventListener('local-storage', handleStorageEvents as EventListener);
    };
  }, [key, initialValue, storedValue]); // storedValue is needed here to ensure the comparison inside is up-to-date

  return [storedValue, setValue];
}

export default useLocalStorage;
