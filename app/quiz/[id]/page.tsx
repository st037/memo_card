import {neon} from "@neondatabase/serverless";
import QuizPlayer from "./quizplayer";

type Props = {
  params: Promise<{
    id:string;
  }>;
};

export default async function QuizPage({params}: Props) {
  const {id} = await params;

  const sql = neon(process.env.DATABASE_URL!);

  const quizzes = await sql`SELECT * FROM quizzes WHERE quiz_set_id = ${id} ORDER BY id`;

  const quiz_sets = await sql`SELECT * FROM quiz_sets WHERE id = ${id}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="anki-title">{quiz_sets[0].title}</h1>
      </div>

      <QuizPlayer quizzes={quizzes}/>
    </div>
  );
}

