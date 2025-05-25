"use client";
import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";
import { LuUser } from "react-icons/lu";

export default function LoginPage() {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-2xl border-0 rounded-lg p-5 bg-gray-10">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-full flex items-center justify-center mb-4">
              <LuUser size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-90">Welcome Back</h1>

            <p className="text-gray-60 text-sm">Sign in to your account</p>
          </div>
        </CardHeader>

        <CardBody className="gap-10">
          <form className="flex flex-col gap-8">
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

            <CustomButton type="submit" size="lg">
              Sign In
            </CustomButton>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-60">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="text-primary-60 hover:text-primary-70 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
