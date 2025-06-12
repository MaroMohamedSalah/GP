"use client";
import { confirmEmail } from "@/app/actions/confirmEmail";
import verifyOtp from "@/app/actions/verfyOtp";
import CustomButton from "@/app/components/atoms/button";
import AuthFormContainer from "@/app/components/molecules/authFormContainer";
import { InputOtp } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type OtpFormData = {
  code: string;
};

const OtpPage = () => {
  const [resendTime, setResendTime] = useState<number | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>();

  const handleResend = async () => {
    setResendLoading(true);
    setResendLoading(true);
    await confirmEmail();
    setResendLoading(false);
    setResendTime(60);
  };

  const onSubmit: SubmitHandler<OtpFormData> = async (data) => {
    setIsLoading(true);
    const verifyOtpRes = await verifyOtp(data.code);
    if (verifyOtpRes.error) {
      setError(verifyOtpRes.error.message);
    } else {
      setError("");
      router.push("/login");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (resendTime && resendTime > 0) {
      const interval = setInterval(() => {
        setResendTime((prev) => (prev ?? 0) - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTime]);

  return (
    <AuthFormContainer
      title="Please verify your email"
      description="We have sent an OTP code to your email"
      altLink="/login"
      altLinkDescription="Already have an account? Sign in"
      altLinkText="Sign in"
      onSubmit={handleSubmit(onSubmit)}
      formError={error}
      buttons={
        <CustomButton type="submit" size="lg" isLoading={isLoading}>
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
        errorMessage={errors.code?.message}
        {...register("code", { required: "OTP is required" })}
      />
      <CustomButton
        size="sm"
        className="w-fit flex self-end"
        onClick={handleResend}
        disabled={resendTime ? resendTime > 0 : false}
        isLoading={resendLoading}
      >
        {resendTime ? `${resendTime}s` : !resendLoading && "Resend"}
      </CustomButton>
    </AuthFormContainer>
  );
};

export default OtpPage;
