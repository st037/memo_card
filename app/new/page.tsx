import {auth} from "@/auth";
import {neon} from "@neondatabase/serverless";
import {redirect} from "next/navigation";
import NewQuizFormClient from "./NewQuizFormClinet";

async function getQuizSets(userId: String) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT id, title FROM quiz_sets WHERE user_id = ${userId} ORDER BY created_at DESC`;
  return data as {id: number; title: string}[];
}

export default async function NewQuizPage() {
  const session = await auth();

  if(!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const quizSets = await getQuizSets(userId);

  return (
    <div className="page-container">
      <NewQuizFormClient quizSets={quizSets}/>
    </div>
  );
}