import type { Metadata } from "next";
import { StoreHydrator } from "@/components/layout/store-hydrator";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FindYourCruze — Find the car that fits you",
    template: "%s · FindYourCruze",
  },
  description:
    "Find cars that fit the way you drive, your budget and your priorities.",
  applicationName: "FindYourCruze",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="min-h-full antialiased">
      <body className="flex min-h-full flex-col">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
