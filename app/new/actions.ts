"use server";

import {neon} from "@neondatabase/serverless";

export async function createQuizAction(quizSetId: number, question: string, answer: string) {

    const sql = neon(process.env.DATABASE_URL!);

    try{
        console.log("サーバー側でデータを受信しました:", {quizSetId, question, answer});

        await sql `INSERT INTO quizzes (quiz_set_id, question, answer) VALUES (${quizSetId}, ${question}, ${answer})`;

        return {success: true};
    } catch(error) {
        console.log("DB保存エラー:", error);
        throw new Error("データベースへの保存に失敗しました。");
    }
}