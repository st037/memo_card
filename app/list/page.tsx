import {auth} from "@/auth";
import {neon} from "@neondatabase/serverless";
import {redirect} from "next/navigation";
import QuizListClient from "./quiz_list_client";

async function getQuizSets(userId: string) {
  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`SELECT * FROM quiz_sets WHERE user_id = ${userId} ORDER BY created_at DESC;`;
  return data as any[];
}

export default async function List() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  console.log("現在ログインしているユーザーのID:", session.user.id);

  const quizSets = await getQuizSets(session?.user.id);
  return <QuizListClient quizSets={quizSets} session={session} />;
}
