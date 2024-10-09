import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { jwtDecode } from "jwt-decode";

function Main() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/login`,
        values
      );
      const { token } = response.data;
      localStorage.setItem("token", token); // Save the JWT token
      // Decode the JWT token to extract user role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      setLoading(false);

      // Success popup using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect based on user role
      if (userRole === "employee") {
        navigate("/project-approved"); // Employee role redirects to 'projects-approved'
      } else if (userRole === "admin") {
        navigate("/product-list"); // Redirect employee to project-approved
      } else if (userRole === "superadmin") {
        navigate("/add-product"); // Redirect employee to project-approved
      } else {
        navigate("/"); // Other roles go to home/dashboard
      } // Redirect to the home page or dashboard
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your email and password.",
      });
    }
  };

  return (
    <>
      <div
        className={clsx([
          "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <ThemeSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img alt="Sufnoor" className="w-6" src={logoUrl} />
                <span className="ml-3 text-lg text-white"> Sufnoor </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Illustration"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  A few more clicks to <br />
                  sign in to your account.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your projects in one place
                </div>
              </div>
            </div>
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Sign In
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                  A few more clicks to sign in to your account.
                </div>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-8 intro-x">
                      <div>
                        <Field
                          name="email"
                          type="text"
                          className={clsx(
                            "block px-4 py-3 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                            {
                              "border-red-500": errors.email && touched.email,
                              "border-slate-300 dark:border-darkmode-400":
                                !errors.email || !touched.email,
                            }
                          )}
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-2 text-red-500 text-xs"
                        />
                      </div>
                      <div className="mt-4">
                        <Field
                          name="password"
                          type="password"
                          className={clsx(
                            "block px-4 py-3 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                            {
                              "border-red-500":
                                errors.password && touched.password,
                              "border-slate-300 dark:border-darkmode-400":
                                !errors.password || !touched.password,
                            }
                          )}
                          placeholder="Password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="mt-2 text-red-500 text-xs"
                        />
                      </div>
                      <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                        <div className="flex items-center mr-auto">
                          <input
                            id="remember-me"
                            type="checkbox"
                            className="mr-2 border"
                          />
                          <label
                            className="cursor-pointer select-none"
                            htmlFor="remember-me"
                          >
                            Remember me
                          </label>
                        </div>
                        <a href="/forgot-password">Forgot Password?</a>
                      </div>
                      <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                        <Button
                          variant="primary"
                          className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
