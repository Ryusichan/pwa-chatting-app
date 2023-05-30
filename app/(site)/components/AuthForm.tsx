"use client";

import AuthSocialButton from "@/app/components/AuthSocialButton";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import axios from "axios";
import { useCallback, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      // Axios Register
      // 서버에 데이터를 새로 생성하고자 할 때 사용 data는 json 형태로 전달
      axios
        .post("/api/register", data)
        // toast를 이용하여 에러 메시지 띄움
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      // NextAuth SignIn
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Logged in successfully");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social SignIn
    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("SocialLogin Something went wrong!");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Logged in successfully");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="
   mt-8
    sm:mx-auto sm:w-full sm:max-w-md
   "
    >
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input label="name" register={register} id="name" errors={errors} />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="Password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
            absolute 
            inset-0 
            flex 
            items-center"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div
              className="
            relative
            flex
            justify-center
            text-sm
            "
            >
              <span
                className="
              bg-white
              px-2
              text-gray-500
              "
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Github && Google Buttons */}

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
          {/* choice Account or Login */}
          <div
            className="
          flex 
          gap-2 
          justify-center 
          text-sm
          mt-6
          px-2
          text-gray-500
          "
          >
            <div>
              {variant === "LOGIN"
                ? "New to Messenger?"
                : "Already have an account?"}
            </div>

            <div
              onClick={toggleVariant}
              className="
              underline
              cursor-pointer
              "
            >
              {variant === "LOGIN" ? "Create an account" : "Log in"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
