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