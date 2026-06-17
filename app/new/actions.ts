"use server";

import {neon} from "@neondatabase/serverless";
import {revalidatePath} from "next/cache";

export async function createQuizAction(
    quizSetId: number | "new",
    newSetTitle: string, 
    newSetDescription: string,
    question: string, 
    answer: string
) {

    const sql = neon(process.env.DATABASE_URL!);

    try{
        let targetSetId :number;

        if (quizSetId === "new") {
            if (!newSetTitle) throw new Error("新規セットのタイトルがありません");

            const [newSet] = await sql`
                INSERT INTO quiz_sets (title, description)
                VALUES (${newSetTitle}, ${newSetDescription || null})
                RETURNING id
            `;
            targetSetId = newSet.id;
        } else {
            targetSetId = quizSetId;
        }

        console.log("サーバー側でデータを受信しました:", {quizSetId, question, answer});

        await sql `
            INSERT INTO quizzes (quiz_set_id, question, answer) 
            VALUES (${targetSetId}, ${question}, ${answer})
        `;

        revalidatePath("/list");
        revalidatePath("/new");
        return {success: true};
    } catch(error) {
        console.log("DB保存エラー:", error);
        throw new Error("データベースへの保存に失敗しました。");
    }
}