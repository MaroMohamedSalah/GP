import { InputProps } from "@heroui/react";

import { Input } from "@heroui/react";
import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
const CustomInput = ({ label, placeholder, type, size }: InputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      label={label}
      placeholder={placeholder}
      type={type}
      size={size}
      classNames={{
        label: "mb-5",
        inputWrapper: "rounded-lg bg-gray-20",
      }}
      endContent={
        type === "password" && (
          <button onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? (
              <LuEye size={20} className="cursor-pointer" />
            ) : (
              <LuEyeClosed size={20} className="cursor-pointer" />
            )}
          </button>
        )
      }
    />
  );
};

export default CustomInput;
