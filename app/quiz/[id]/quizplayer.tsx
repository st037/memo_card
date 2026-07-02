"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { deleteQuizCardAction } from "./actions";

export default function QuizPlayer(props: { quizzes: any[] }) {
    const router = useRouter();
    const params = useParams();
    const quizSetId = params.id as string;

    const [index, setIndex] = useState(0);
    const quiz = props.quizzes[index];
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

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
        if (isTransitioning) return;
        setShowAnswer((prev) => !prev);
    };

    const handleNext = () => {
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

    return (
        <div className="quiz-container">
            
            {/* 🛠️ 管理操作ヘッダー：ここに3つとも並べます */}
            <div className="quiz-ctrl-header">
                <button className="ctrl-btn" onClick={handleBack}>
                    ホーム
                </button>
                
                {/* 💡 真ん中に配置されるカウンター文字 */}
                <span className="ctrl-counter">
                    {index + 1}/{props.quizzes.length}
                </span>

                <button className="ctrl-btn ctrl-btn-delete" onClick={handleDeleteCard}>
                    削除
                </button>
            </div>

            {/* フラッシュカード本体 */}
            <div className={`flash-card ${showAnswer ? "is-flipped" : ""} ${isTransitioning ? "no-animation" : ""}`} onClick={handleCardClick}>
                <div className="card-inner">
                    <div className="card-front">
                        <h2 className="question">{quiz.question}</h2>
                    </div>

                    <div className="card-back">
                        <p className="answer">{quiz.answer}</p>
                    </div>
                </div>
            </div>

            {/* 下部：ゲーム進行ボタン */}
            <div className="quiz-play-bottom-container">
                <button className="quiz-button" onClick={handleReturn}>
                    戻る
                </button>
                <button className="quiz-button" onClick={handleNext}>
                    次へ
                </button>
            </div>
        </div>
    );
}