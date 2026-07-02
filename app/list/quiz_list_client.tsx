"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { deleteQuizSetAction } from "./actions";
import { signOut } from "next-auth/react";
import {Session} from "next-auth";

type QuizSet = {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
};

type Props = {
    quizSets: QuizSet[];
    session: Session | null;    
};

export default function QuizListClient({ quizSets, session }: Props) {
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

  const handleLogout = async() => {
    const confirmed = window.confirm("ログアウトしてもよろしいですか？");
    if (!confirmed) return;
    await signOut({callbackUrl: "/"});
  };

  return (
  /*クイズ一覧*/
  <div className="page-container">

    <div className="page-header">
        {session && (
            <p style={{ color: "#38bdf8", marginBottom: "12px", fontSize: "16px", fontWeight: "bold", textAlign: "center"}}>
                ログイン中: {session.user?.name || "ユーザー"} さん
            </p>
        )}

        <h1 className="anki-title">クイズセット</h1>

        <div>

            <button onClick={handleAdd} className="ctrl-btn">
                新規追加
            </button>

            <button onClick={handleBack} className="ctrl-btn">
                メニュー
            </button>

            <button onClick={handleLogout} className="ctrl-btn ctrl-btn-delete">
                ログアウト
            </button>

        </div>
        
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