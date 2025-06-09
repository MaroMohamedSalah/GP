"use client";

import { confirmEmail } from "@/app/actions/confirmEmail";
import { signup } from "@/app/actions/signup";
import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();
  const router = useRouter();
  const [error, setError] = useState("");

  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data, event) => {
    event?.preventDefault();

    try {
      const signupRes = await signup(data);
      if (signupRes.error) {
        if (signupRes.error.code === "ALREADY_EXISTS") {
          setError("This username or email already exists");
        } else {
          setError(signupRes.message);
        }
      } else {
        setError("");
        localStorage.setItem("token", signupRes.data.token);
        await confirmEmail();
        router.push("/otp");
      }
    } catch {
      setError("An error occurred during signup");
    }
  };

  return (
    <AuthFormContainer
      title="Create an account"
      description="Sign up to get started"
      altLink="/login"
      altLinkDescription="Already have an account? Sign in"
      altLinkText="Sign in"
      onSubmit={handleSubmit(onSubmit)}
      formError={error}
      buttons={
        <CustomButton type="submit" size="lg">
          Sign Up
        </CustomButton>
      }
    >
      <CustomInput
        label="Username"
        placeholder="Enter your username"
        errorMessage={errors.username?.message}
        type="text"
        size="lg"
        {...register("username", {
          required: "Username is required",
          validate: (value) =>
            !value.includes(" ") || "Username cannot contain spaces",
        })}
      />

      <CustomInput
        label="Email"
        placeholder="Enter your email"
        errorMessage={errors.email?.message}
        type="email"
        size="lg"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        errorMessage={errors.password?.message}
        type="password"
        size="lg"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />

      <CustomInput
        label="Confirm Password"
        placeholder="Confirm your password"
        type="password"
        errorMessage={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        size="lg"
      />
    </AuthFormContainer>
  );
};

export default RegisterPage;
