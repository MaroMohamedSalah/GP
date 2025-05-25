"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-70 h-screen">
      <div className="container">
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
