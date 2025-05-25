import { Button, ButtonProps } from "@heroui/react";

const CustomButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      type={props.type}
      className="w-full bg-gradient-to-r cursor-pointer from-primary-60 to-primary-70 text-white font-medium py-3 rounded-lg hover:from-primary-70 hover:to-primary-80 transition-all duration-200 shadow-lg hover:shadow-xl"
      size={props.size}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
