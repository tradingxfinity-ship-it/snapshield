"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-mist pt-[92px]">
      <div className="container-x flex flex-col items-center py-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 14 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-white shadow-glow"
        >
          <Check className="h-10 w-10" strokeWidth={3} />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-navy">Order confirmed</h1>
        <p className="mt-3 max-w-md text-slate-600">
          Thank you! Your payment went through and your Snap Shield order is being prepared. A
          confirmation email with tracking is on its way.
        </p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/shop">Continue Shopping</ButtonLink>
          <ButtonLink href="/" variant="secondary">Back Home</ButtonLink>
        </div>
      </div>
    </div>
  );
}
