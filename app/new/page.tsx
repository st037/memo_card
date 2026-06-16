"use client";
import {useRouter} from "next/navigation";
import { useState } from "react";
import { createQuizAction } from "./actions";

export default function NewQuizPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const[answer, setAnswer] = useState("");
  const[isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent<Element>) => {
    e.preventDefault();
    if(!question || !answer) {
      alert("問題と答えを入力してください。");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuizAction(1, question, answer);

      alert("カードを追加しました");
      setQuestion("");
      setAnswer("");
      router.refresh();
    } catch(error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="page-container">
      <div className="page-header">
        <h1 className="anki-title">新規追加</h1>

        <button onClick={handleBack} className="home-button">
          HOME
        </button>
      </div>

      <form onSubmit={handleSubmit} className="new-quiz-form">
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
