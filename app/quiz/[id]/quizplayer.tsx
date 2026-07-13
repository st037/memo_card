"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteQuizCardAction, updateQuizCardAction } from "./actions";

export default function QuizPlayer(props: { quizzes: any[] }) {
    const router = useRouter();
    const params = useParams();
    const quizSetId = params.id as string;

    const [index, setIndex] = useState(0);
    const quiz = props.quizzes[index];
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer,setEditAnswer] = useState("");

    useEffect(() => {
        if (quiz) {
            setEditQuestion(quiz.question);
            setEditAnswer(quiz.answer);
        }
        setIsEditing(false);
    }, [index, quiz]);

    if (props.quizzes.length === 0) {
        return (
            <div className="quiz-container">
                <p className="quiz-container">カードがありません</p>
                <button className="quiz-button" onClick={() => router.push("/list")}>一覧に戻る</button>
            </div>
        );
    }

    const handleBack = () => {
        router.push("/list");
    };

    const handleCardClick = () => {
        if (isTransitioning || isEditing) return;
        setShowAnswer((prev) => !prev);
    };

    const handleNext = () => {
        if (isEditing) return;
        setIsTransitioning(true);
        setShowAnswer(false);

        setIndex((prev) => {
            if (prev >= props.quizzes.length - 1) return 0;
            return prev + 1;
        });

        setTimeout(() => {
            setIsTransitioning(false);
        }, 50);
    };

    const handleReturn = () => {
        if (isEditing) return;
        setIsTransitioning(true);
        setShowAnswer(false);

        setIndex((prev) => {
            if (prev <= 0) return 0;
            return prev - 1;
        });

        setTimeout(() => {
            setIsTransitioning(false);
        }, 50);
    };

    const handleDeleteCard = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const confirmed = window.confirm("このクイズカードを削除してもよろしいですか？");
        if (!confirmed) return;

        try {
            await deleteQuizCardAction(quiz.id, quizSetId);
            alert("カードを削除しました");

            if (index >= props.quizzes.length - 1 && index > 0) {
                setIndex(index - 1);
            }
            setShowAnswer(false);
        } catch (error) {
            console.error(error);
            alert("削除に失敗しました");
        }
    };

    const handleSaveEdit = async(e: React.MouseEvent) => {
        e.stopPropagation();
        if (!editQuestion.trim() || !editAnswer.trim()) {
            alert("問題文と答えの両方を入力してください。");
            return;
        }

        try {
            await updateQuizCardAction(quiz.id, editQuestion, editAnswer, quizSetId);
            alert("カードを更新しました!");
            setIsEditing(false);
        } catch(error) {
            console.error(error);
            alert("更新に失敗しました。");
        }
    };

    return (
        <div className="quiz-container">
            
            <div className="quiz-ctrl-header">
                <button className="ctrl-btn" onClick={handleBack}>
                    ホーム
                </button>
                
                {/* カウンター */}
                <span className="ctrl-counter">
                    {index + 1}/{props.quizzes.length}
                </span>

                <div className="ctrl-btn-group">
                    {isEditing ? (
                        <button className="ctrl-btn ctrl-btn-save" onClick={handleSaveEdit}>
                            保存
                        </button>
                    ) : (
                        <button className="ctrl-btn ctrl-btn-edit" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
                            編集
                        </button>
                    )}

                    <button className="ctrl-btn ctrl-btn-delete" onClick={handleDeleteCard}>
                        削除
                    </button>
                </div>
            </div>

            <div className={`flash-card ${showAnswer ? "is-flipped" : ""} ${isTransitioning ? "no-animation" : ""}`} onClick={handleCardClick}>
                <div className="card-inner">
                    {isEditing ? (
                        <div className="card-front" onClick={(e) => e.stopPropagation()}>
                            <div className="edit-form-container"> 
                                <label className="edit-label">
                                    問題文:
                                    <input type="text" className="edit-input" value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                                </label>
                                <label className="edit-label">
                                    答え:
                                    <textarea className="edit-textarea" value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="card-front">
                                <h2 className="question">{quiz.question}</h2>
                            </div>

                            <div className="card-back">
                                <p className="answer">{quiz.answer}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="quiz-play-bottom-container">
                <button className="quiz-button" onClick={handleReturn} disabled={isEditing}>
                    戻る
                </button>
                <button className="quiz-button" onClick={handleNext} disabled={isEditing}>
                    次へ
                </button>
            </div>
        </div>
    );
}