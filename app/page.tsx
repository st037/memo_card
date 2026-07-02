import {auth, signIn, signOut} from "@/auth";
import Link from "next/link";

export default async function Home() {

  const session = await auth();

  return (
    <div className="page-container">
      <div className="page-header">
        {session ? (
          <>
            <p style={{ color: "#38dbf8", marginBottom: "20px", fontSize: "16px", fontWeight: "bold"}}>
              ログイン中: {session.user?.name || "ユーザー"} さん
            </p>

            <Link href="/list" style={{textDecoration: "none", color: "inherit"}}>
              <button /*onClick={handleStart}*/>
                <h1 className="anki-title">
                  クイズセット一覧
                </h1>
              </button>
            </Link>

            <br />

            <form action={async () => {
              "use server";
              await signOut({redirectTo: "/"});
            }}
            >
              <button className="home-button">
                ログアウト
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="anki-title">
              ログインが必要です
            </h1>
            <p>
                クイズアプリを利用するにはGitHubアカウントでサインインしてください。
            </p>

            <form
              action={async () => {
                "use server";
                await signIn("github", {redirectTo: "/list"});
              }} 
            >
              <button className="start-button">
                GitHub アカウントでログイン
              </button>
            </form>
          </>
        )}
      </div>
    </div>);
}