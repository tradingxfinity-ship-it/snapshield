import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4">
      {/* branded backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy via-brand-900 to-brand-700" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-400/20 blur-[120px]" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
