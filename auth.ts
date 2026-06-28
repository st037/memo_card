import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [GitHub({
        profile(profile) {
            console.log("🕵️① profile関数が動いた:", profile.id);
            return {id: String(profile.id), name: profile.name || profile.login};
        },
    })],
    callbacks: {

        async jwt({token, account}) {
            console.log("🕵️② jwt関数に入った時の token.sub:", token.sub);
            if(account) {
                console.log("🕵️②-A 初回ログイン時の user.id:", account.id);
                token.fixedId = String(account.providerAccountId);
            }
            console.log("🕵️②-B jwt関数が返す tokenの中身:", token);
            return token;
        },

        async session({session, token}) {
            console.log("🕵️③ session関数に入った時の token.fixedId:", token.fixedpuId);
            if (session. user && token.fixedId) {
                session.user.id = token.fixedId as string;
            }
            console.log("🕵️③-A 最終的に画面に渡す session.user.id:", session.user?.id);
            return session;
        },
    },
});
