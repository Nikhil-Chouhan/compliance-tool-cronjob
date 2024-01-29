"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGlobe, FaSearch, FaUserTie } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { BsBoxArrowRight } from "react-icons/bs";
import { Button } from "react-bootstrap";

export default function Navbar() {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  const fullName =
    session.data?.user.first_name + " " + session.data?.user.last_name;
  //const role_id = session.data?.user.role_id;

  return (
    <div className=" m-0 p-0 z-9">
      {isLoggedIn ? (
        <header className="d-flex flex-wrap justify-content-space-between">
          <div className="col-md-12 row align-items-center m-0 p-3 adminnav  ">
            <div className="col-md-4 px-4">
              <Link href="/">
                {" "}
                <Image
                  src="/regucheck_logo.png"
                  alt="ReguCheck"
                  width={180}
                  height={40}
                />
              </Link>
            </div>

            <div className="col-md-8">
              <ul className="nav d-flex flex-wrap align-items-center justify-content-end">
                {/* <li className="nav-item dropdown">
                  <div className="nav-link text-decoration-none py-2 text-black">
                    <FaSearch />
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <div className="nav-link text-decoration-none py-2 text-black">
                    <FaGlobe /> English
                  </div>
                </li> */}
                <li className="nav-item dropdown">
                  <Link
                    className="btn light btn-primary light btn-md btn-rounded mx-2"
                    href="#!"
                  >
                    <FaUserTie className="mx-2" size={20} />
                    {fullName}
                  </Link>
                </li>
                <li className="nav-item">
                  <Button
                    className="btn light btn-danger btn-md btn-rounded"
                    onClick={() => signOut({ redirect: false })}
                  >
                    <BsBoxArrowRight className="mx-2" size={20} />
                    <b>Logout</b>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </header>
      ) : (
        <header className="d-flex flex-wrap justify-content-space-between py-2 px-4">
          <div className="row">
            <div className="col-md-12">
              <Image src="/logo.png" alt="Logo" width={100} height={50} />
            </div>
          </div>
        </header>
      )}
    </div>
  );
}
