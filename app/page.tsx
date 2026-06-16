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
  <div className="page-header">
    <button onClick={handleStart}>
      <h1 className="anki-title">
       クイズセット一覧
      </h1>
    </button>
    <br></br>
    <button onClick={handleAdd}>
      <h1 className="anki-title">
        カードを追加する
      </h1>
    </button>
  </div>);
}
