"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AccountMenu } from "@/components/account-menu";

export function HeaderAuthSlot() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <span className="h-9 w-9 shrink-0" aria-hidden />;
  }

  if (user) {
    return (
      <AccountMenu
        name={String(user.user_metadata?.full_name ?? "")}
        email={user.email ?? ""}
      />
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden text-[13.5px] font-medium whitespace-nowrap text-text-2 transition-colors hover:text-text sm:block"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-blue px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-navy-2"
      >
        Sign up
      </Link>
    </>
  );
}
