"use client";

import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";

const RegisterPage = () => {
  return (
    <AuthFormContainer
      title="Create an account"
      description="Sign up to get started"
      onSubmit={() => {}}
      altLink="/login"
      altLinkDescription="Already have an account? Sign in"
      altLinkText="Sign in"
      buttons={
        <CustomButton type="submit" size="lg">
          Sign Up
        </CustomButton>
      }
    >
      <CustomInput
        label="Name"
        placeholder="Enter your name"
        type="text"
        size="lg"
      />

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

      <CustomInput
        label="Confirm Password"
        placeholder="Confirm your password"
        type="password"
        size="lg"
      />
    </AuthFormContainer>
  );
};

export default RegisterPage;
