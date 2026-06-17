import {neon} from "@neondatabase/serverless";
import NewQuizFormClient from "./NewQuizFormClinet";

async function getQuizSets() {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT id, title FROM quiz_sets ORDER BY created_at DESC`;
  return data as {id: number; title: string}[];
}

export default async function NewQuizPage() {
  const quizSets = await getQuizSets();

  return (
    <div className="page-container">
      <NewQuizFormClient quizSets={quizSets}/>
    </div>
  );
}