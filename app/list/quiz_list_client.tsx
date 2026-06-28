"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { deleteQuizSetAction } from "./actions";

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

  const handleDeleteSet = async (id: number, title:string) => {
    const confirmed = window.confirm(`「${title}」を削除してもよろしいですか？\n※含まれるクイズカードもすべて消去されます。`);
    if (!confirmed) return;

    try {
        const result = await deleteQuizSetAction(id);
        if (result.success) {
            alert("削除しました!");
        }
    } catch (error) {
        console.error(error);
        alert("削除に失敗しました");
    }
  };

  const handleAdd = () => {
    router.push("./new");
  };

  return (
  /*クイズ一覧*/
  <div className="page-container">

    <div className="page-header">
        <h1 className="anki-title">クイズセット</h1>
        
        <button onClick={handleBack} className="home-button">
          HOME
        </button>
        
    </div>

    {quizSets.map((set) => (
        <div key={set.id} className="quiz-card">

            <button
                onClick={() => handleDeleteSet(set.id, set.title)}
                className="delete-button"
            >
                削除
            </button>

            <h2 className="quiz-title quiz-title-with-delete">
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