import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "./AuthContext.jsx";

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  if (admin) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }) => {
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl bg-card-bg p-8 shadow-[0_4px_25px_rgba(0,0,0,0.08)]"
      >
        <h1 className="text-lg font-extrabold text-brand-green-primary">Lokmangal Foundation Admin</h1>
        <p className="mt-1 text-sm text-secondary-text">Sign in to manage site content.</p>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-full bg-brand-orange-accent px-4 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
