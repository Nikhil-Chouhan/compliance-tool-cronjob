"use client";

import { FormEvent, useRef } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { inputStyles } from "../styles/constants";
import Toast, { ToastType } from "@/components/Toast_old";
import { Button } from "react-bootstrap";
import "../loginstyles.css";
import { FaEnvelope, FaUserLock } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const toastRef = useRef<ToastType>();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const form = document.querySelector(".needs-validation") as HTMLFormElement;
    form?.classList.add("was-validated");

    if (!form?.checkValidity()) {
      return;
    }

    signIn("credentials", {
      username: e.target.username.value,
      password: e.target.password.value,
      redirect: false,
    })
      .then((response) => {
        if (response && !response.error) {
          router.replace("/");
        } else {
          // setToastAtomValue({ ...toastAtomValue, visible: true });
          toastRef.current.show(
            "Error",
            "Login Failed! Please Enter Correct Credentials"
          );
          signOut({ redirect: false });
        }
      })
      .catch((e) => console.log("got error", e));
  };

  return (
    <>
      <div className="LoginPageContainer">
        <div className="row LoginPageInnerContainer">
          <div className="col-md-6 ImageContianer">
            <Image
              className="position-relative GroupImage"
              src="/compliance_login1.png"
              alt="Sign In Image"
              fill={true}
            />
          </div>
          <div className="col-md-6 LoginFormContainer justify-content-center">
            <div className="col-md-8 LoginFormInnerContainer ">
              <div className="LogoContainer d-flex justify-content-center">
                <Image
                  className="logo "
                  src="/regucheck_logo1.png"
                  alt="ReguCheck"
                  width="260"
                  height="500"
                />
              </div>
              <header className="header text-center">
                <b>Sign In</b>
              </header>
              <header className="subHeade text-secondary text-center">
                Welcome to <b>ReguCheck!</b>
              </header>

              <form
                className="needs-validation"
                method="POST"
                noValidate
                onSubmit={onSubmit}
              >
                <div className="form-group inputContainer justify-content-center">
                  <label className="label">
                    <FaEnvelope size={20} className="mx-3" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="text"
                    name={"username"}
                    className="form-control p-3"
                    style={inputStyles}
                    id="username"
                    placeholder="Enter your Email Address"
                    required
                  />
                </div>
                <div className="inputContainer">
                  <label className="label">
                    <FaUserLock size={25} className="mx-3" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    className="form-control p-3"
                    style={inputStyles}
                    name={"password"}
                    placeholder="Enter your Password"
                    id="password"
                    required
                  />
                </div>
                <div className="OptionsContainer">
                  <div className="checkboxContainer">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="checkbox"
                    />{" "}
                    <label>
                      <b>Remember me</b>
                    </label>
                  </div>
                  <a href="#" className="ForgotPasswordLink">
                    Forgot Password?
                  </a>
                </div>
                <div className="text-center ">
                  <Button
                    type="submit"
                    className="col-md-10 mt-4 btn light btn-primary btn-lg btn-rounded"
                  >
                    <b>Log In</b>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Toast ref={toastRef} />
      </div>
    </>
  );
}
