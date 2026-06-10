import {neon} from "@neondatabase/serverless";
import QuizListClient from "./quiz_list_client";

async function getQuizSets() {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT * FROM quiz_sets ORDER BY created_at DESC;`;
  return data as any[];
}

export default async function List() {
  const quizSets = await getQuizSets();
  return <QuizListClient quizSets={quizSets} />;
}
