"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@taskforge/shared";
import { forgotPassword } from "@/lib/api/auth";
import { Button } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { Label } from "@taskforge/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@taskforge/ui";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      setError(null);
      await forgotPassword(data);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a password reset link. Check your inbox and follow the instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
          <Link
            href="/login"
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
