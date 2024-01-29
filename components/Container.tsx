"use client";
import { useSession } from "next-auth/react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import Sidebar from "@/components/Sidebar";
import { useAtom } from "jotai";
import { sidebarAtom } from "@/atoms/sidebar";

const protectedRoutes = ["/login"];

export default function Container({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = session.status === "authenticated";

  useEffect(() => {
    if (
      protectedRoutes.includes(pathname) &&
      session.status === "authenticated"
    ) {
      router.replace("/");
    }
  }, [router, session.status, pathname]);

  const [sidebarShown] = useAtom(sidebarAtom);

  return (
    <>
      {isLoggedIn ? (
        <>
          <div className="justify-content-center mt-75">
            <div
              className={`row custom_row vh-100 ${
                sidebarShown ? "" : "sidebar-hidden"
              }`}
            >
              <div className={`col-md-${sidebarShown ? "2" : "1"} px-0`}>
                <Sidebar />
              </div>
              <div className={`col-md-${sidebarShown ? "10" : "11"} px-0 `}>
                <div className="container-fluid ">{children}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="custom_row row">
            <div className="col-md-12 px-0">{children}</div>
          </div>
        </>
      )}
    </>
  );
}
