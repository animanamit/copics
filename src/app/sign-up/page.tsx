"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Google OAuth handles both sign-up and sign-in in one flow
// Redirect to sign-in page
export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-in");
  }, [router]);

  return null;
}
