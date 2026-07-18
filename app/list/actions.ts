"use server";

import {neon} from "@neondatabase/serverless"
import { revalidatePath } from "next/cache";

export async function deleteQuizSetAction(id: number) {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        await sql `
            DELETE FROM quiz_sets WHERE id = ${id}
        `;

        revalidatePath("/list");
        return {success: true};
    } catch (error) {
        console.error("クイズセット削除エラー", error);
        throw new Error("削除に失敗しました。");
    }
}

export async function updateQuizSetAction(id: number, title: string, description: string | null) {
    const sql = neon(process.env.DATABASE_URL!);

    if (!title.trim()) {
        throw new Error("タイトルを入力してください。");
    }

    try {
        await sql`
            UPDATE quiz_sets SET title = ${title}, description = ${description} WHERE id = ${id}
        `;

        revalidatePath("/list");
        return { success: true }
    } catch (error) {
        console.error("クイズセット更新エラー, error");
        throw new Error("クイズセットの更新に失敗しました。");
    }
}