"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function SimpleHomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">What to Watch Tonight</h1>
        <p className="text-lg mb-8">Simple test page to check for errors</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Count: {count}
        </button>
      </main>
    </div>
  );
}
