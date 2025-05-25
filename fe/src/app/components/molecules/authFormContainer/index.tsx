import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";
import { ReactNode } from "react";
import { LuUser } from "react-icons/lu";

interface AuthFormContainerProps {
  // onSubmit: FormEventHandler<HTMLFormElement>;
  onSubmit: () => void;
  formError?: string;
  children: ReactNode;
  title: string;
  description?: string;
  buttons: ReactNode;
  altLink?: string;
  altLinkText?: string;
  altLinkDescription?: string;
}

const AuthFormContainer = ({
  children,
  title,
  description,
  buttons,
  altLink,
  altLinkText,
  altLinkDescription,
}: AuthFormContainerProps) => {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-2xl border-0 rounded-lg p-5 bg-gray-10">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-full flex items-center justify-center mb-4">
              <LuUser size={24} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-90">{title}</h1>

            <p className="text-gray-60 text-sm">{description}</p>
          </div>
        </CardHeader>

        <CardBody className="gap-10">
          <form className="flex flex-col gap-8">
            {children}

            {buttons}
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-60">
              <span className="me-2">{altLinkDescription}</span>
              <Link
                href={altLink || "#"}
                className="text-primary-60 hover:text-primary-70 font-medium"
              >
                {altLinkText}
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AuthFormContainer;
