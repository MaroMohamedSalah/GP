import { Button, ButtonProps } from "@heroui/react";

const CustomButton = ({ children, variant, ...props }: ButtonProps) => {
  const baseStyles =
    "w-full cursor-pointer font-medium py-3 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

  const gradientStyles =
    variant === "bordered"
      ? ""
      : "bg-gradient-to-r from-primary-60 via-primary-65 to-primary-70 hover:from-primary-70 hover:via-primary-75 hover:to-primary-80 active:from-primary-80 active:via-primary-85 active:to-primary-90";

  return (
    <Button
      type={props.type}
      className={`${baseStyles} ${gradientStyles} ${props.className}`}
      size={props.size}
      onClick={props.onClick}
      color={props.color}
      disabled={props.disabled}
      isLoading={props.isLoading}
      variant={variant}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
