import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
      {/* bright branded backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/50 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-brand-100/60 blur-[110px]" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
