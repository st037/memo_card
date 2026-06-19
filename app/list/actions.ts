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