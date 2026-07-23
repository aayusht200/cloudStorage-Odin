import { useContext, useState } from "react";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserContext, type SignupPayload } from "../context/UserContext";
export default function SignupPage() {
  const { signupUser } = useContext(UserContext);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupPayload>({
    shouldUseNativeValidation: false,
    progressive: false,
  });
  const onSubmit: SubmitHandler<SignupPayload> = async (data) => {
    setError(false);

    try {
      await signupUser({
        email: data.email,
        password: data.password,
        lastName: data.lastName,
        firstName: data.firstName,
      });
      navigate("/login");
    } catch {
      setError(true);
    }
  };
  const onError: SubmitErrorHandler<SignupPayload> = () => setError(false);
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>CloudDrive</CardTitle>
          <CardDescription>Signup to CloudDrive</CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adam"
                  {...register("firstName", {
                    required: "Required field",
                  })}
                />
                {errors.firstName && (
                  <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Cole"
                  {...register("lastName", {
                    required: "Required field",
                  })}
                />
                {errors.lastName && (
                  <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {errors.lastName.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email", {
                    required: "Required field",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message:
                        "Email should match the pattern : example@email.com",
                    },
                  })}
                />
                {errors.email && (
                  <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Required field.",
                    minLength: { value: 8, message: "Minimum length is 8" },
                    maxLength: { value: 64, message: "Maximum length is 64" },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                      message:
                        "Must contain uppercase, lowercase, number and special character",
                    },
                  })}
                />
                {errors.password && (
                  <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {errors.password.message}
                  </span>
                )}
              </div>
              {error && (
                <p>
                  User already exists
                  <Button variant="link" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                </p>
              )}
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full cursor-pointer"
              >
                {isSubmitting ? "Signing up..." : "Signup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
