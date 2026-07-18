import {auth} from "@/auth";
import {neon} from "@neondatabase/serverless";
import {redirect, notFound} from "next/navigation";
import QuizPlayer from "./quizplayer";

type Props = {
  params: Promise<{
    id:string;
  }>;
};

export default async function QuizPage({params}: Props) {

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const {id} = await params;
  const sql = neon(process.env.DATABASE_URL!);

  const quiz_sets = await sql`SELECT * FROM quiz_sets WHERE id = ${id} AND user_id = ${userId}`;

  if(quiz_sets.length === 0) {
    notFound();
  }

  const quizzes = await sql`SELECT * FROM quizzes WHERE quiz_set_id = ${quiz_sets[0].id} ORDER BY id`;


  return (
    <div>
      <div className="page-header">
        <h1 className="anki-title">{quiz_sets[0].title}</h1>
      </div>

      <QuizPlayer quizzes={quizzes}/>
    </div>
  );
}