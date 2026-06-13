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

    const handleBack = () => {
    router.push("/list");
    };

    return (
        <div>
            <h2>{quiz.question}</h2>

            {showAnswer && (
                <p>{quiz.answer}</p>
            )}

            {!showAnswer ? (
                <button onClick={() => setShowAnswer(true)}>
                    答えを見る
                </button>
            ) : (
                <button onClick={() => {
                    setShowAnswer(false);

                    if (index < props.quizzes.length - 1){
                        setIndex(index + 1);
                    } else if(index == props.quizzes.length - 1){
                        setIndex(index - (props.quizzes.length - 1));
                    }
                }}>
                    次へ
                </button>
            )}
            <br></br>
            <button onClick={handleBack}>戻る</button>
        </div>
    );
}

