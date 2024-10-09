import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Validation schema for Formik
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Function to handle forgot password API call
  const handleForgotPassword = async (values) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/api/auth/forgot-password`,
        { email: values.email }
      );
      setSuccessMessage("Password reset link sent to your email.");
      // Optional: Navigate to a different page (e.g., to check email)
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      setErrorMessage("Failed to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                recover your account.
              </div>
              <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                Manage all your projects in one place
              </div>
            </div>
          </div>
          <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
              <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                Forgot Password
              </h2>
              <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                Enter your email to receive a password reset link.
              </div>

              {/* Success and Error Messages */}
              {errorMessage && (
                <div className="text-red-500 text-center mt-4">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-center mt-4">
                  {successMessage}
                </div>
              )}

              {/* Formik Form */}
              <Formik
                initialValues={{ email: "" }}
                validationSchema={validationSchema}
                onSubmit={handleForgotPassword}
              >
                {({ isSubmitting }) => (
                  <Form className="mt-8 intro-x">
                    {/* Email Field */}
                    <div>
                      <Field
                        type="email"
                        name="email"
                        className={clsx(
                          "block px-4 py-3 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                          "border-slate-300 dark:border-darkmode-400"
                        )}
                        placeholder="Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 whitespace-nowrap text-center"
                        disabled={isSubmitting || loading}
                      >
                        {loading ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          "Send Reset Link"
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
  );
};

export default Main;
