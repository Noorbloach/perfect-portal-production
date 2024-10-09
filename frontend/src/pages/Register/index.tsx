// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { jwtDecode } from "jwt-decode";
// import ThemeSwitcher from "@/components/ThemeSwitcher";
// import logoUrl from "@/assets/images/logo.svg";
// import illustrationUrl from "@/assets/images/illustration.svg";
// import { FormInput, FormSelect } from "@/components/Base/Form";
// import Button from "@/components/Base/Button";
// import clsx from "clsx";
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// function Main() {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchUserRole = () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const decodedToken = jwtDecode(token);
//           setUserRole(decodedToken.role);
//         }
//       } catch (err) {
//         // Handle error if needed
//       }
//     };

//     fetchUserRole();
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       name: '',
//       email: '',
//       password: '',
//       role: 'employee'
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required('Name is required'),
//       email: Yup.string().email('Invalid email address').required('Email is required'),
//       password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//       role: Yup.string().required('Role is required')
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);

//       try {
//         const response = await fetch('${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(values),
//         });

//         const result = await response.json();

//         if (response.ok) {
//           formik.resetForm();
//           Swal.fire({
//             icon: 'success',
//             title: 'Registration Successful',
//             text: 'You can now log in.',
//             showConfirmButton: false,
//             timer: 1500
//           });
//           navigate('/users-layout-2');
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Registration Failed',
//             text: result.message || 'Please try again.',
//           });
//         }
//       } catch (err) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Server Error',
//           text: 'Please try again later.',
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   return (
//     <>
//       <div
//         className={clsx([
//           "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
//           "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
//           "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
//         ])}
//       >
//         <ThemeSwitcher />
//         <div className="container relative z-10 sm:px-10">
//           <div className="block grid-cols-2 gap-4 xl:grid">
//             <div className="flex-col hidden min-h-screen xl:flex">
//               <a href="" className="flex items-center pt-5 -intro-x">
//                 <img
//                   alt="Logo"
//                   className="w-6"
//                   src={logoUrl}
//                 />
//                 <span className="ml-3 text-lg text-white"> Sufnoor </span>
//               </a>
//               <div className="my-auto">
//                 <img
//                   alt="Illustration"
//                   className="w-1/2 -mt-16 -intro-x"
//                   src={illustrationUrl}
//                 />
//                 <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
//                   A few more clicks to <br />
//                   Register a user account.
//                 </div>
//                 <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
//                   Manage all your accounts in one place
//                 </div>
//               </div>
//             </div>
//             <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
//               <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
//                 <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
//                   Add User
//                 </h2>
//                 <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
//                   A few more clicks to add user.
//                 </div>
//                 <form onSubmit={formik.handleSubmit}>
//                   <div className="mt-8 intro-x">
//                     <FormInput
//                       name="name"
//                       type="text"
//                       className={clsx("block px-4 py-3 intro-x min-w-full xl:min-w-[350px] border rounded-lg", {
//                         'border-red-500': formik.errors.name && formik.touched.name,
//                         'border-slate-300 dark:border-darkmode-400': !formik.errors.name || !formik.touched.name
//                       })}
//                       placeholder="Name"
//                       value={formik.values.name}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       isInvalid={formik.touched.name && formik.errors.name}
//                     />
//                     {formik.touched.name && formik.errors.name ? (
//                       <div className="text-red-400 text-sm">{formik.errors.name}</div>
//                     ) : null}

//                     <FormInput
//                       name="email"
//                       type="email"
//                       className={clsx("block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border rounded-lg", {
//                         'border-red-500': formik.errors.email && formik.touched.email,
//                         'border-slate-300 dark:border-darkmode-400': !formik.errors.email || !formik.touched.email
//                       })}
//                       placeholder="Email"
//                       value={formik.values.email}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       isInvalid={formik.touched.email && formik.errors.email}
//                     />
//                     {formik.touched.email && formik.errors.email ? (
//                       <div className="text-red-400 text-sm">{formik.errors.email}</div>
//                     ) : null}

//                     <FormInput
//                       name="password"
//                       type="password"
//                       className={clsx("block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border rounded-lg", {
//                         'border-red-500': formik.errors.password && formik.touched.password,
//                         'border-slate-300 dark:border-darkmode-400': !formik.errors.password || !formik.touched.password
//                       })}
//                       placeholder="Password"
//                       value={formik.values.password}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       isInvalid={formik.touched.password && formik.errors.password}
//                     />
//                     {formik.touched.password && formik.errors.password ? (
//                       <div className="text-red-400 text-sm">{formik.errors.password}</div>
//                     ) : null}

//                     <FormSelect
//                       name="role"
//                       className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
//                       value={formik.values.role}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       disabled={userRole === 'admin'}
//                       isInvalid={formik.touched.role && formik.errors.role}
//                     >
//                       {userRole === 'superadmin' ? (
//                         <>
//                           <option value="admin">admin</option>
//                           <option value="employee">employee</option>
//                         </>
//                       ) : (
//                         <option value="employee">employee</option>
//                       )}
//                     </FormSelect>
//                     {formik.touched.role && formik.errors.role ? (
//                       <div className="text-red-500 text-sm">{formik.errors.role}</div>
//                     ) : null}
//                   </div>
//                   <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
//                     <Button
//                       variant="primary"
//                       className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
//                       type="submit"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <FontAwesomeIcon icon={faSpinner} spin />
//                       ) : (
//                         'Register'
//                       )}
//                     </Button>

//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Main;
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Main() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
        }
      } catch (err) {
        // Handle error if needed
      }
    };

    fetchUserRole();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "employee", // Default role for new users
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const result = await response.json();

        if (response.ok) {
          formik.resetForm();
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "You can now log in.",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/users-layout-2");
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: result.message || "Please try again.",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

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
              <img alt="Logo" className="w-6" src={logoUrl} />
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
                Register a user account.
              </div>
              <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                Manage all your accounts in one place
              </div>
            </div>
          </div>
          <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
              <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                Add User
              </h2>
              <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                A few more clicks to add user.
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="mt-8 intro-x">
                  <FormInput
                    name="name"
                    type="text"
                    className={clsx(
                      "block px-4 py-3 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                      {
                        "border-red-500":
                          formik.errors.name && formik.touched.name,
                        "border-slate-300 dark:border-darkmode-400":
                          !formik.errors.name || !formik.touched.name,
                      }
                    )}
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && formik.errors.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-400 text-sm">
                      {formik.errors.name}
                    </div>
                  ) : null}

                  <FormInput
                    name="email"
                    type="email"
                    className={clsx(
                      "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                      {
                        "border-red-500":
                          formik.errors.email && formik.touched.email,
                        "border-slate-300 dark:border-darkmode-400":
                          !formik.errors.email || !formik.touched.email,
                      }
                    )}
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && formik.errors.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-400 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}

                  <FormInput
                    name="password"
                    type="password"
                    className={clsx(
                      "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border rounded-lg",
                      {
                        "border-red-500":
                          formik.errors.password && formik.touched.password,
                        "border-slate-300 dark:border-darkmode-400":
                          !formik.errors.password || !formik.touched.password,
                      }
                    )}
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-400 text-sm">
                      {formik.errors.password}
                    </div>
                  ) : null}

                  <FormSelect
                    name="role"
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.role && formik.errors.role}
                  >
                    {userRole === "superadmin" ? (
                      <>
                        <option value="admin">admin</option>
                        <option value="employee">employee</option>
                      </>
                    ) : userRole === "management" ? (
                      <>
                        <option value="superadmin">superadmin</option>
                        <option value="management">management</option>
                        <option value="admin">admin</option>
                        <option value="employee">employee</option>
                      </>
                    ) : (
                      <option value="employee">employee</option>
                    )}
                  </FormSelect>
                  {formik.touched.role && formik.errors.role ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.role}
                    </div>
                  ) : null}
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
                      "Register"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
