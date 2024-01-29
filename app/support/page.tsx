"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
  FaUser,
  FaComments,
} from "react-icons/fa";
import Image from "next/image";

export default function Support() {
  const [fullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <div className=" bg-white rounded-corner p-4">
          <h5 className="fw-strong px-1 mb-3 ">
            Contact Us - We&apos;d love to hear from you!
          </h5>
          <hr></hr>
          <div className="row custom_row d-felx justify-content-center align-items-center">
            <div className="col-md-7 my-auto px-0">
              <div className=" align-items-center">
                <div className="row custom_row justify-content-center">
                  <Image
                    className="supportImage p-0"
                    src="/support.jpg"
                    alt="Support"
                    width="60"
                    height="300"
                  />
                </div>
                <div className="row custom_row d-flex justify-content-center">
                  <div className="col-md-8 text-center">
                    <b>ReguCheck LLC. </b>
                    <p className="m-2">
                      905, Raheja Residency, Juhu Nagar, MG Complex, Sector 14,
                      Vashi, Navi Mumbai, Maharashtra 400703
                    </p>
                    <div>
                      <p className="m-1">
                        <FaEnvelope className="me-3" />
                        <a href="mailto:support@regucheck.com">
                          support@regucheck.com
                        </a>
                      </p>
                      <p className="m-1">
                        <FaPhoneAlt className="me-3" />
                        <a href="tel:+1234567890">+1234567890</a>
                      </p>
                      <p>
                        <FaGlobe className="me-3" />
                        <a
                          href="https://www.regucheck.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://www.regucheck.com/
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 px-0">
              <div className="row custom_row">
                <form onSubmit={handleSubmit}>
                  <div className="input-group  mb-3">
                    <button className="btn btn-primary light p-3" type="button">
                      <FaUser size={15} />
                    </button>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      className="form-control input-padding"
                      placeholder="Search"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <button className="btn btn-primary light p-3" type="button">
                      <FaPhoneAlt size={15} />
                    </button>
                    <input
                      type="tel"
                      id="mobileNo"
                      placeholder="Mobile Number"
                      className="form-control input-padding"
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3 ">
                    <button className="btn btn-primary light p-3" type="button">
                      <FaEnvelope size={15} />
                    </button>
                    <input
                      type="email"
                      id="email"
                      className="form-control input-padding"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <button className="btn btn-primary light p-3" type="button">
                      <FaComments size={20} />
                    </button>
                    <textarea
                      id="query"
                      placeholder=" Query"
                      className="form-control input-padding"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary light p-2">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
