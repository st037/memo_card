"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function QuizPlayer(
    props: {quizzes: any[];}
) {
    const router = useRouter();

    const [index, setIndex] = useState(0);
    const quiz = props.quizzes[index];
    
    const [showAnswer, setShowAnswer] = useState(false);

    const [isTransitioning, setIsTransitioning] = useState(false);

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
            return prev + 1
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

    return (
        <div className="quiz-container">
            <div className="quiz-counter">
                {index + 1}/{props.quizzes.length}
            </div>

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
            <div className="button-container">
                <button className="quiz-button" onClick={handleReturn}>戻る</button>
                <button className="quiz-button" onClick={handleNext}>次へ</button>
                <button className="quiz-button" onClick={handleBack}>一覧</button>
            </div>
        </div>
    );
}
