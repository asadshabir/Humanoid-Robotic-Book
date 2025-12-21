/**
 * SSR-safe utilities for Docusaurus-based Physical AI & Humanoid Robotics book
 *
 * This module provides helper functions to ensure components work safely during
 * server-side rendering without accessing browser-specific APIs.
 */

/**
 * Checks if the code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Checks if the code is running in a Node.js environment
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Safely accesses window object properties
 * @param accessor - Function that accesses window properties
 * @param fallback - Fallback value when running on server
 * @returns The result of the accessor function or fallback value
 */
export const safeWindowAccess = <T>(accessor: () => T, fallback: T): T => {
  if (isBrowser()) {
    try {
      return accessor();
    } catch (error) {
      console.warn('Error accessing window object:', error);
      return fallback;
    }
  }
  return fallback;
};

/**
 * Safely accesses document object properties
 * @param accessor - Function that accesses document properties
 * @param fallback - Fallback value when running on server
 * @returns The result of the accessor function or fallback value
 */
export const safeDocumentAccess = <T>(accessor: () => T, fallback: T): T => {
  if (isBrowser()) {
    try {
      return accessor();
    } catch (error) {
      console.warn('Error accessing document object:', error);
      return fallback;
    }
  }
  return fallback;
};

// Note: The following React-dependent functions would typically be in a separate file
// since this utility file should not directly depend on React to maintain SSR safety.
// They are included here as examples of patterns to follow.

/**
 * Utility to import modules only on the client-side
 * @param importFn - Function that returns a dynamic import promise
 * @returns The imported module or null if on server
 */
export const clientOnlyImport = async <T,>(importFn: () => Promise<T>): Promise<T | null> => {
  if (isBrowser()) {
    try {
      return await importFn();
    } catch (error) {
      console.warn('Error importing client-only module:', error);
      return null;
    }
  }
  return null;
};