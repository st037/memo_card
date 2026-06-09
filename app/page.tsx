"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("./list");
  };

  return (
  <div className="anki-title">
    <button onClick={handleStart}>暗記アプリ</button>
  </div>);
}
