"use server";

import {auth} from "@/auth";
import {neon} from "@neondatabase/serverless";
import {revalidatePath} from "next/cache";

export async function deleteQuizCardAction(id: number, quizSetId: string) {

    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("ログインが必要です。");
    }

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            DELETE FROM quizzes WHERE id = ${id} AND quiz_set_id IN (SELECT id FROM quiz_sets WHERE id = ${Number(quizSetId)} AND user_id = ${userId})
        `;

        revalidatePath(`/quiz/${quizSetId}`);
        return {seuccess: true};
    } catch (error) {
        console.error("カード削除エラー:", error);
        throw new Error("カードの削除に失敗しました。");
    }
}

export async function updateQuizCardAction(cardId: number, question: string, answer: string, quizSetId: string) {

    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("ログインが必要です。");
    } 

    const userId = session.user.id;
    const sql = neon(process.env.DATABASE_URL!);

    try {
        await sql`
            UPDATE quizzes
            SET question = ${question}, answer = ${answer}
            WHERE id = ${cardId}
                AND quiz_set_id IN (
                    SELECT id FROM quiz_sets WHERE id = ${Number(quizSetId)} AND user_id = ${userId}
                )
        `;

        revalidatePath(`/quiz/${quizSetId}`);
        return { success: true }
    } catch (error) {
        console.error("カード更新エラー:", error);
        throw new Error("カードの更新に失敗しました。");
    }
}