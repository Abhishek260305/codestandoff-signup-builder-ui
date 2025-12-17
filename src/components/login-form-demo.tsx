"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  field?: string;
  message: string;
}

export default function LoginFormDemo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }
    if (!formData.password) {
      return "Password is required";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError({ message: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call GraphQL API
      const response = await fetch("http://localhost:8080/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in request/response
        body: JSON.stringify({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                user {
                  id
                  email
                  firstName
                  lastName
                }
                token
                expiresAt
              }
            }
          `,
          variables: {
            email: formData.email,
            password: formData.password,
          },
        }),
      });

      const result = await response.json();

      // Handle GraphQL errors (from backend validation)
      if (result.errors) {
        const errorMessage = result.errors[0].message || "Login failed";
        // Check for specific error messages
        if (errorMessage.toLowerCase().includes("invalid email") || 
            errorMessage.toLowerCase().includes("invalid password")) {
          setError({ 
            message: "Invalid email or password. Please check your credentials and try again.",
            field: "credentials"
          });
        } else {
          setError({ message: errorMessage });
        }
        setIsSubmitting(false);
        return;
      }

      // Check if login was successful
      if (result.data?.login) {
        // Token is automatically stored in HTTP cookie by the backend
        // Clear any old localStorage data first
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_expires_at');
        
        // Store user info in localStorage for client-side state
        localStorage.setItem("user", JSON.stringify(result.data.login.user));
        
        // Redirect to host-ui dashboard
        window.location.href = "http://localhost:3000";
      } else {
        setError({ message: "Login failed. Please try again." });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError({ 
        message: err.message || "Network error. Please check if the backend is running." 
      });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome back to CodeStandoff
      </h2>
      <p className="mt-2 mb-6 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign in to your account to continue
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error.message}</p>
          {error.field === "credentials" && (
            <p className="text-xs text-red-600 dark:text-red-300 mt-1">
              Make sure you're using the email and password you signed up with.
            </p>
          )}
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="projectmayhem@fc.com" 
            type="email" 
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={error?.field === "credentials" ? "border-red-300 dark:border-red-700" : ""}
            required
            autoComplete="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            placeholder="••••••••" 
            type="password" 
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={error?.field === "credentials" ? "border-red-300 dark:border-red-700" : ""}
            required
            autoComplete="current-password"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in →'}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="button"
            onClick={() => {
              // Redirect to GitHub OAuth
              const redirectUri = encodeURIComponent("http://localhost:3000");
              window.location.href = `http://localhost:8080/auth/github?redirect_uri=${redirectUri}`;
            }}
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="button"
            onClick={() => {
              // Redirect to Google OAuth
              const redirectUri = encodeURIComponent("http://localhost:3000");
              window.location.href = `http://localhost:8080/auth/google?redirect_uri=${redirectUri}`;
            }}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

