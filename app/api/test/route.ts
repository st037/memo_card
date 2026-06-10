import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 💡 .env.local に書いた DATABASE_URL を自動で読み込んでNeonに接続する
    const sql = neon(process.env.DATABASE_URL!);

    // 💡 Neonに最初から入っているお試し用テーブル（playing_with_neon）からデータを全件取得する生SQL
    const result = await sql`SELECT * FROM quiz_sets;`;

    // 成功したら、取得したデータを画面にJSONで表示する
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // 接続に失敗したら、エラー内容を表示する
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}