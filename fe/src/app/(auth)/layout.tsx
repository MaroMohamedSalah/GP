import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-90 via-gray-80 to-gray-100">
      <div className="flex items-center justify-center min-h-dvh container">
        {children}
      </div>
    </div>
  );
}
