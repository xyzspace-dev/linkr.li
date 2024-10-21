"use client";

import { redirect } from "next/navigation";

export default function Home() {
  return (
    <>
      {process.env.NEXTDEFAULT_PAGE && redirect(process.env.NEXTDEFAULT_PAGE)}
    </>
  );
}
