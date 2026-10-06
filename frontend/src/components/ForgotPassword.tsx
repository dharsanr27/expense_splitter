// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      // Don't leak whether the email exists — generic message either way
      console.error(error);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
        <p className="text-muted-foreground">
          If an account exists for {email}, we've sent a password reset link.
        </p>
        <Link to="/" className="mt-4 inline-block underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Forgot your password?</h1>
      <p className="text-muted-foreground text-sm">
        Enter your email and we'll send you a reset link.
      </p>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="border rounded-md px-3 py-2"
      />

      {status === "error" && (
        <p className="text-destructive text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="cursor-pointer bg-primary text-primary-foreground rounded-md py-2 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send reset link"}
      </button>

      <Link to="/" className="text-sm underline text-center">
        Back to login
      </Link>
    </form>
  );
}