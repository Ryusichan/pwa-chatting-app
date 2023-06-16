import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  // conversations 추가해준다
  matcher: ["/users/:path*", "/conversations/:path*"],
};
