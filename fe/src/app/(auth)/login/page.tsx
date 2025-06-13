"use client";
import { login } from "@/app/actions/login";
import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    const loginRes = await login(data.email, data.password);
    if (loginRes.error) {
      setError(loginRes.error.message);
    } else if (loginRes.data.user.email.isVerified) {
      setError("");
      localStorage.setItem("userData", JSON.stringify(loginRes.data.user));
      localStorage.setItem("token", loginRes.data.token);
      router.push("/chat");
    } else {
      setError("Please verify your email");
      setTimeout(() => {
        router.push("/otp");
      }, 3000);
    }
    setIsLoading(false);
  };

  return (
    <AuthFormContainer
      title="Welcome Back"
      description="Sign in to your account"
      altLink="/register"
      altLinkDescription="Don't have an account? Sign up"
      altLinkText="Sign up"
      onSubmit={handleSubmit(onSubmit)}
      formError={error}
      buttons={
        <CustomButton type="submit" size="lg" isLoading={isLoading}>
          Sign In
        </CustomButton>
      }
    >
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        type="email"
        size="lg"
        errorMessage={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        type="password"
        size="lg"
        errorMessage={errors.password?.message}
        {...register("password", { required: "Password is required" })}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-60 bg-gray-10 border-gray-30 rounded focus:ring-primary-60 focus:ring-2"
          />
          <span className="text-sm text-gray-70">Remember me</span>
        </label>

        <Link
          href="#"
          className="text-sm text-primary-60 hover:text-primary-70"
        >
          Forgot password?
        </Link>
      </div>
    </AuthFormContainer>
  );
}
