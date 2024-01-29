"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const unprotectedRoutes = ["/error", "/forget_password"];

export default function ProtectRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!unprotectedRoutes.includes(pathname) && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status, pathname]);

  return <>{children}</>;
}
