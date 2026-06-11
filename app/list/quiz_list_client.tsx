"use client";
import {useRouter} from "next/navigation";
import { StringLiteral } from "typescript";

type QuizSet = {
    id: number;
    title: string;
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

  const handleStartQuiz = (quizSetId: number) => {
    router.push(`/quiz/${quizSetId}`);
  };

  return (
  /*クイズ一覧*/
  <div className="page-container">

    <div className="page-header">
        <h1 className="anki-title">クイズ一覧</h1>

        {/*戻るボタンを追加*/}
        <button onClick={handleBack} className="home-button">
          HOME
        </button>
    </div>

    <p>挑戦するクイズセットを選んでださい。</p>

    {quizSets.map((set) => (
        <div key={set.id} className="quiz-card">

            <h2 className="quiz-title">
                {set.title}
            </h2>

            {set.description && (

                <p className="quiz-description">
                    {set.description}
                </p>

            )}

            <button className="start-button" onClick={() => handleStartQuiz(set.id)}>
                クイズを始める
            </button>

        </div>
    ))}
  </div>
  );
}