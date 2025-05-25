"use client";
import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthFormContainer
      title="Welcome Back"
      description="Sign in to your account"
      onSubmit={() => {}}
      altLink="/register"
      altLinkDescription="Don't have an account? Sign up"
      altLinkText="Sign up"
      buttons={
        <CustomButton type="submit" size="lg">
          Sign In
        </CustomButton>
      }
    >
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        type="email"
        size="lg"
      />

      <CustomInput
        label="Password"
        placeholder="Enter your password"
        type="password"
        size="lg"
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
