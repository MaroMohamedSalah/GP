"use client";

import { InputProps } from "@heroui/react";
import { Input } from "@heroui/react";
import { useState, forwardRef } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";

// Extend InputProps to accept all react-hook-form props
type CustomInputProps = InputProps & {
  errorMessage?: string;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, placeholder, type, size, errorMessage, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const getInputType = () => {
      if (type === "password") {
        return isVisible ? "text" : "password";
      }
      return type;
    };

    return (
      <div className="w-full">
        <Input
          {...rest}
          label={label}
          placeholder={placeholder}
          type={getInputType()}
          size={size}
          classNames={{
            label: "mb-5",
            inputWrapper: "rounded-lg bg-gray-20",
          }}
          ref={ref}
          endContent={
            type === "password" && (
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                tabIndex={-1}
              >
                {isVisible ? (
                  <LuEye size={20} className="cursor-pointer" />
                ) : (
                  <LuEyeClosed size={20} className="cursor-pointer" />
                )}
              </button>
            )
          }
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
