"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// A tiny global notification service. Compare it to a singleton service you'd
// register in .NET DI: set it up once, then call it from anywhere.

type ToastContextValue = {
  showToast: (message: string) => void;
};

// The "contract" of the service that gets shared down the component tree.
const ToastContext = createContext<ToastContextValue | null>(null);

// Any component calls: const { showToast } = useToast();
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}

// Wrap the app once (we do this in app/layout.tsx).
// It holds the current message, draws the toast box, and provides showToast().
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500); // auto-hide after 2.5s
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* The toast — only rendered when there is a message */}
      {message && (
        <div className="fixed top-6 right-6 z-[100] rounded-lg bg-[#0E3D2E] px-4 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}