import {neon} from "@neondatabase/serverless";

type Props = {
  params: Promise<{
    id:string;
  }>;
};

export default async function QuizPage({params}: Props) {
  const {id} = await params;
}