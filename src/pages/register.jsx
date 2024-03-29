import * as yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";
import { Wrapper } from "../components/ui/Wrapper";
import { Button } from "../components/ui/Button";
import { Input, PInput } from "../components/Input";
import { useCanSubmitForm } from "../hooks/useCanSubmitFormik";
import { useAxios } from "../hooks/useAxios";
import { useState } from "react";
import { Icon } from "@iconify/react";

export const Component = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axios = useAxios();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    username: yup.string().required().min(3, "must be at least 3 characters"),
    phone: yup.string().required(),
    email: yup.string().email().required(),
    password: yup
      .string()
      .trim()
      .required()
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "", username: "", phone: "" },
    validationSchema: schema,
    onSubmit: async (values, {}) => {
      try {
        setIsSubmitting(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/register`,
          values,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 201) {
          setIsSubmitting(false);
          navigate(
            `/confirm-otp?email=${encodeURIComponent(values.email)}&otp=${
              response.data.otpCode
            }`
          );
        }
      } catch (error) {
        setIsSubmitting(false);
        console.log(error.response.data.message);
      }
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  return (
    <Wrapper className="max-w-xl flex flex-col items-center py-12">
      <Heading>Register</Heading>
      <p className="text-[#666666] py-4 text-center">
        Create Your account, Already have an account?
        <Link to="/login" className="text-app-black ml-2">
          Login Here
        </Link>
      </p>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl p-4"
      >
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Input
            name="username"
            formik={formik}
            className="bg-app-ash-1"
            placeholder="Full Name"
          />
          <Input
            name="phone"
            formik={formik}
            className="bg-app-ash-1"
            placeholder="Phone Number"
          />
          <Input
            name="email"
            formik={formik}
            className="bg-app-ash-1"
            placeholder="Email Address"
          />
          <PInput
            name="password"
            formik={formik}
            className="bg-app-ash-1"
            placeholder="Password"
          />
        </div>

        <Button
          className="w-full flex justify-center bg-app-red hover:bg-red-500 text-sm  text-white font-bold mt-4 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? (
            <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 20 }} />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Wrapper>
  );
};
