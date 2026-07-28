import { zodResolver } from "@hookform/resolvers/zod";
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
import { UserContext } from "../context/User";
import { signupSchema, type SignupPayload } from "../schema/auth";
export default function SignupPage() {
  const { signupUser } = useContext(UserContext);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupPayload>({ resolver: zodResolver(signupSchema) });
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
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adam"
                  {...register("firstName")}
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
                  {...register("lastName")}
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
                  {...register("email")}
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
                  {...register("password")}
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
