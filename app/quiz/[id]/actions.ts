"use server";

import {neon} from "@neondatabase/serverless";
import {revalidatePath} from "next/cache";

export async function deleteQuizCardAction(id: number, quizSetId: string) {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            DELETE FROM quizzes WHERE id = ${id}
        `;

        revalidatePath(`/quiz/${quizSetId}`);
        return {seuccess: true};
    } catch (error) {
        console.error("カード削除エラー:", error);
        throw new Error("カードの削除に失敗しました。");
    }
}

export async function updateQuizCardAction(cardId: number, question: string, answer: string, quizSetId: string) {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        await sql`
            UPDATE quizzes
            SET question = ${question}, answer = ${answer}
            WHERE id = ${cardId}
        `;

        revalidatePath(`/quiz/${quizSetId}`);
        return { success: true }
    } catch (error) {
        console.error("カード更新エラー:", error);
        throw new Error("カードの更新に失敗しました。");
    }
}