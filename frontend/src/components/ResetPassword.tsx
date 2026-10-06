// src/pages/ResetPassword.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Supabase fires PASSWORD_RECOVERY when the recovery link's session lands
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Fallback: if a session already exists (e.g. on fast refresh), allow it
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(() => navigate("/"), 2000);
  };

  if (!ready) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p className="text-muted-foreground">
          Verifying your reset link... if this doesn't resolve, the link may have expired.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h1 className="text-xl font-semibold mb-2">Password updated</h1>
        <p className="text-muted-foreground">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Set a new password</h1>

      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="border rounded-md px-3 py-2"
      />
      <input
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        className="border rounded-md px-3 py-2"
      />

      {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="cursor-pointer bg-primary text-primary-foreground rounded-md py-2 disabled:opacity-50"
      >
        {status === "loading" ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}