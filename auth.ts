import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// 💡 ここで読み込まれている環境変数をコンソールに出力する
/*console.log("【デバッグ】AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID);
// セキュリティ上、秘密鍵は一部だけ（最初の4文字と文字数）見せるようにマスクして出力すると安全です
const rawSecret = process.env.AUTH_GOOGLE_SECRET || "";
const maskedSecret = rawSecret 
  ? `${rawSecret.substring(0, 4)}... (全長: ${rawSecret.length}文字)` 
  : "⚠️ 未設定 (undefined / 空)";
console.log("【デバッグ】AUTH_GOOGLE_SECRET:", maskedSecret);*/

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [
        GitHub({
            profile(profile) {
                console.log("[GitHub]profile関数が動いた:", profile.id);
                return { id: String(profile.id), name: profile.name || profile.login };
            },
        }),

        Google({
            profile(profile) {
                console.log("[Google]profile関数が動いた:", profile.sub);
                return { id: String(profile.sub), name: profile.name };
            },
        }),
    ],
    callbacks: {

        async jwt({token, account}) {
            console.log("jwt関数に入った時の token.sub:", token.sub);
            if(account) {
                console.log("初回ログイン時の user.id:", account.id);
                token.fixedId = String(account.providerAccountId);
            }
            console.log("jwt関数が返す tokenの中身:", token);
            return token;
        },

        async session({session, token}) {
            console.log("session関数に入った時の token.fixedId:", token.fixedId);
            if (session. user && token.fixedId) {
                session.user.id = token.fixedId as string;
            }
            console.log("最終的に画面に渡す session.user.id:", session.user?.id);
            return session;
        },
    },
});
