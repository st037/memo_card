"use client";
import {useRouter} from "next/navigation";
import { useState } from "react";
import { createQuizAction } from "./actions";

type QuizSet = {
    id: number;
    title: string;
};

export default function NewQuizFormClient({quizSets}: {quizSets: QuizSet[]}) {
  const router = useRouter();

  const[quizSetId, setQuizSetId] = useState<number | "new">(quizSets[0]?.id || 1);
  const[newSetTitle, setNewSetTitle] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");
  const[question, setQuestion] = useState("");
  const[answer, setAnswer] = useState("");
  const[isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.push("/list");
  };

  const handleSubmit = async (e: React.FormEvent<Element>) => {
    e.preventDefault();
    if(!question || !answer) {
      alert("問題と答えを入力してください。");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuizAction(quizSetId, newSetTitle, newSetDescription, question, answer);

      alert("カードを追加しました");
      setQuestion("");
      setAnswer("");
      setNewSetTitle("");
      setNewSetDescription("");
      router.refresh();
    } catch(error) {
      console.error(error);
      alert("保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="page-container">
      <div className="page-header">
        <h1 className="anki-title">新規追加</h1>

        <button onClick={handleBack} className="home-button">
          ホーム
        </button>
      </div>

      <form onSubmit={handleSubmit} className="new-quiz-form">

        <div className="form-group">
            <label className="quiz-title">追加先のクイズセット</label>
            <select 
                value={quizSetId}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuizSetId(val === "new" ? "new" : Number(val))
                }}
                className="form-input"
            >
                <option value="new">新しいクイズセットを作る</option>
                {quizSets.map((set) => (
                    <option key={set.id} value={set.id}>
                        {set.title}
                    </option>
                ))}
            </select>
        </div>

        {quizSetId === "new" && (
          <>
            <div className="form-group">
              <label className="quiz-title">新規クイズセット</label>
              <input
                value={newSetTitle}
                onChange={(e) => setNewSetTitle(e.target.value)}
                placeholder="例: 世界史の年号"
                className="form-input"
                maxLength={14}
              />
            </div>

            <div className="form-group">
              <label className="quiz-title">セットの説明</label>
              <textarea
                value={newSetDescription}
                onChange={(e) => setNewSetDescription(e.target.value)}
                placeholder="例: 定期テスト対策用の単語帳"
                className="form-input"
                maxLength={50}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label className="quiz-title">
            問題（表面）
          </label>
          <input 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="例: Banana"
            className="form-input"
            maxLength={25}
          />
        </div>

        <div className="form-group">
          <label className="quiz-title">
            答え（裏面）
          </label>
          <textarea 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="例: ばなな"
            rows={3}
            className="form-textarea"
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          className="form-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : "カードを追加する"}
        </button>
      </form>
  </div>
  );
}
