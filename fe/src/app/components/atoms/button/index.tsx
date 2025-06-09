import { Button, ButtonProps } from "@heroui/react";

const CustomButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      type={props.type}
      className={`w-full bg-gradient-to-r cursor-pointer from-primary-60 to-primary-70 text-white font-medium py-3 rounded-lg hover:from-primary-70 hover:to-primary-80 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 ${props.className}`}
      size={props.size}
      onClick={props.onClick}
      color={props.color}
      disabled={props.disabled}
      isLoading={props.isLoading}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
