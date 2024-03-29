import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Heading } from "../components/Heading";
import { Input, PInput } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useCanSubmitForm } from "../hooks/useCanSubmitFormik";
import { useAxios } from "../hooks/useAxios";
import { Wrapper } from "../components/ui/Wrapper";
import { Button } from "../components/ui/Button";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const Component = () => {
  const axios = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .trim()
      .required()
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long"),
    // .matches(/(?=.*[^\w\d\s])/, "must contain special character")
  });

  const naigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const login = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`login`, values, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setIsSubmitting(false);
        setAccessToken(response?.data?.accessToken);
        setUser({
          username: response?.data?.username,
          email: response?.data?.email,
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            username: response?.data?.username,
            email: response?.data?.email,
          })
        );
        naigate(decodeURIComponent(redirect));
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  return (
    <Wrapper className="max-w-lg flex flex-col items-center py-12">
      <Heading>Login</Heading>
      <p className="py-4 text-[#666666] text-center">
        Your Welcome back don&rsquo;t have an account?
        <Link to="/register" className="text-app-black ml-2">
          Register Here{" "}
        </Link>
      </p>

      <form onSubmit={formik.handleSubmit} className="w-full">
        <Input name="email" formik={formik} placeholder="Email" />
        <PInput name="password" formik={formik} placeholder="Password" />

        <Link
          to={"/forgot-password"}
          className="text-app-black pb-6 text-right w-full inline-block"
        >
          Forgot Password?
        </Link>

        <Button
          className="w-full flex justify-center bg-app-red hover:bg-red-500 text-sm  text-white font-bold mt-4 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 20 }} />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Wrapper>
  );
};
