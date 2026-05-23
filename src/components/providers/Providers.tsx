"use client";

import { LenisProvider } from "./LenisProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LenisProvider>{children}</LenisProvider>;
}
