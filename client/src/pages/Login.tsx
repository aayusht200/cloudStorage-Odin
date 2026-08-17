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
import { HoverCardReadme } from "../components/ui/HoverCard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserContext } from "../context/User";
import { loginSchema, type LoginPayload } from "../schema/auth";
export function Login() {
  const { loginUser } = useContext(UserContext);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    setError(false);

    try {
      await loginUser(data);
      navigate("/", { replace: true });
    } catch {
      setError(true);
    }
  };
  const onError: SubmitErrorHandler<LoginPayload> = () => setError(false);
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>CloudDrive</CardTitle>
          <CardDescription>
            Login to your account
            <HoverCardReadme />
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              aria-label="signup-button"
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            aria-label="Login form"
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                  aria-describedby={errors.email ? "email-error" : undefined}
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
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <span className="flex items-center gap-2 text-sm leading-none font-medium text-red-600 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {errors.password.message}
                  </span>
                )}
              </div>
              {error && (
                <p aria-label="form-error">Invalid email or password</p>
              )}
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full cursor-pointer"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
