"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { deleteQuizSetAction, updateQuizSetAction } from "./actions";
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

  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  const startEdit = (set: QuizSet) => {
    setEditingSetId(set.id);
    setEditTitle(set.title);
    setEditDescription(set.description || "");
  };

  const cancelEdit = () => {
    setEditingSetId(null);
    setEditTitle("");
    setEditDescription("");
  }

  const handleSaveSet = async (id : number) =>  {
    if (!editTitle.trim()) {
        alert("タイトルは必須です");
        return;
    }

    try {
        const result = await updateQuizSetAction(id, editTitle, editDescription);
        if (result.success) {
            setEditingSetId(null);
        }
    } catch (error) {
        console.error(error);
        alert("更新に失敗しました");
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

    {quizSets.map((set) => {
        const isEditing = editingSetId === set.id;

        return (
            
            <div key={set.id} className="quiz-card quiz-card-wrapper">
                {isEditing ? (
                    <div className="edit-form-container">
                        <div>
                            <label className="edit-form-label">タイトル</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="edit-form-input"
                            />
                        </div>
                        <div>
                            <label className="edit-form-label">説明</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="edit-form-textarea"
                            />
                        </div>
                        <div className="edit-form-buttons">
                            <button
                                onClick={() => handleSaveSet(set.id)}
                                className="start-button btn-save"
                            >
                                保存
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="ctrl-btn btn-cancel"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                ) : (

                    <>
                        <div className="quiz-card-actions-top">
                            <button
                                onClick={() => startEdit(set)}
                                className="delete-button edit-action-btn"
                            >
                                編集
                            </button>

                            <button
                                onClick={() => handleDeleteSet(set.id, set.title)}
                                className="delete-button"
                            >
                                削除
                            </button>
                        </div>

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
                    </>

                )}

            </div>
        
        );
    })}
  </div>
  );
}
