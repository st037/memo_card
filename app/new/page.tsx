"use client";
import {useRouter} from "next/navigation";

export default function List() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
  /*クイズ一覧*/
  <div className="anki-title">
    <h1>
      新規追加
    </h1>

    {/*戻るボタンを追加*/}
    <button onClick={handleBack} className="home-button">
      HOME
    </button>
  </div>);
}
