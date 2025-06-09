"use client";
import CustomButton from "@/app/components/atoms/button";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";
import { InputOtp } from "@heroui/react";

const OtpPage = () => {
  return (
    <AuthFormContainer
      title="Please verify your email"
      description="We have sent an OTP code to your email"
      altLink="/login"
      altLinkDescription="Already have an account? Sign in"
      altLinkText="Sign in"
      buttons={
        <CustomButton type="submit" size="lg">
          Verify
        </CustomButton>
      }
    >
      <InputOtp
        length={4}
        variant="flat"
        size="lg"
        fullWidth
        classNames={{
          segmentWrapper: "gap-5",
          wrapper: "flex justify-center w-full",
          segment: "bg-gray-20 border-gray-30",
        }}
      />
    </AuthFormContainer>
  );
};

export default OtpPage;
