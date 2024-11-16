
import NextAuth from "next-auth"

import Google from "next-auth/providers/google"

const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    authorization: {
      params: {
        // prompt: "consent",
        // access_type: "offline",
        // response_type: "code",
        scope:'https://www.googleapis.com/auth/streetviewpublish openid profile email',
      },
    },
  })],
  session:{
    maxAge: 3599,
    updateAge: 3599
  },
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      const _session = Object.assign(session)
      _session.accessToken = token.accessToken
      return _session
    },
    // authorized: async ({ auth }) => {
    //   // Logged in users are authenticated, otherwise redirect to login page
    //   return !!auth
    // },
  }
})

export { handlers, signIn, signOut, auth }