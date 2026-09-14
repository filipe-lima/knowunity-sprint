import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knowie",
  description:
    "Voice active-recall for Knowunity: student speaks a term, Knowie judges it and replies in text only, never voice.",
};

// No mobile-frame constraint existed anywhere in the app shell before this —
// every screen is meant for a 390px canvas (docs/sprint-context.md), same
// width every Storybook story already assumes, so it's enforced once here
// rather than per screen. items-start (not center) so a screen taller than
// the viewport scrolls instead of clipping.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex justify-center items-start">
        <div className="w-full max-w-[390px]">{children}</div>
      </body>
    </html>
  );
}
