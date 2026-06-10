"use client";
import {useRouter} from "next/navigation";
import { StringLiteral } from "typescript";

type QuizSet = {
    id: number;
    title: String;
    description: string | null;
    created_at: string;
};

type Props = {
    quizSets: QuizSet[];    
};

export default function QuizListClient({ quizSets }: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
  /*クイズ一覧*/
  <div>
    <h1 className="anki-title">クイズ一覧</h1>

    {/*戻るボタンを追加*/}
    <button onClick={handleBack} className="home-button">
      HOME
    </button>
    <p>挑戦するクイズセットを選んでださい。</p>
    {quizSets.map((set) => (
        <div key={set.id}>
            <h2>
                {set.title}
            </h2>
            {set.description && (
                <p>
                    {set.description}
                </p>
            )}

            <button>
                クイズを始める
            </button>
        </div>
    ))}
  </div>
  );
}