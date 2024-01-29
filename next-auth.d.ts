import { user } from "@prisma/client";

declare module "next-auth/JWT" {
  interface JWT {
    user: User;
  }
}

declare module "next-auth" {
  interface User extends user {
    id: number;
  }

  interface Session {
    user: User;
  }
}
