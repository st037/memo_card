"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("./list");
  };

  const handleAdd = () => {
    router.push("./new");
  };

  return (
  <div className="anki-title">
    <button onClick={handleStart}>
      <h1>
       クイズセット一覧
      </h1>
    </button>
    <br></br>
    <button onClick={handleAdd}>
      <h1>
        カードを追加する
      </h1>
    </button>
  </div>);
}
