"use server";

import {auth} from "@/auth";
import {neon} from "@neondatabase/serverless";
import {revalidatePath} from "next/cache";

export async function createQuizAction(
    quizSetId: number | "new",
    newSetTitle: string, 
    newSetDescription: string,
    question: string, 
    answer: string
) {

    const session = await auth();

    if(!session?.user?.id) {
        throw new Error("ログインが必要です。");
    }

    const userId = session.user.id;

    const sql = neon(process.env.DATABASE_URL!);

    try{
        let targetSetId :number;

        if (quizSetId === "new") {
            if (!newSetTitle) throw new Error("新規セットのタイトルがありません");

            const [newSet] = await sql`
                INSERT INTO quiz_sets (title, description, user_id)
                VALUES (${newSetTitle}, ${newSetDescription || null}, ${userId})
                RETURNING id
            `;
            targetSetId = newSet.id;

        } else {

            const [validSet] = await sql`
                SELECT id FROM quiz_sets
                WHERE id = ${quizSetId} AND user_id = ${userId}
            `;

            if (!validSet) {
                throw new Error("指定されたクイズセットが見つからないか、アクセス権限がありません。");
            }

            targetSetId = quizSetId;

        }

        console.log("サーバー側でデータを受信しました:", {targetSetId, question, answer});

        await sql `
            INSERT INTO quizzes (quiz_set_id, question, answer) 
            VALUES (${targetSetId}, ${question}, ${answer})
        `;

        revalidatePath("/list");
        revalidatePath("/new");
        return {success: true};
    } catch(error) {
        console.log("DB保存エラー:", error);
        throw new Error(error instanceof Error ? error.message : "データベースへの保存に失敗しました。");
    }
}