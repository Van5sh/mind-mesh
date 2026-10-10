"use client";

// Next remounts `template.tsx` (unlike layout.tsx) on every navigation, so
// this gives every page in the app a subtle fade+rise on entry for free -
// animate-fade-in already existed in globals.css but nothing used it.
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
