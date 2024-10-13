"use client";

export default function Home() {
  return (
    <>
      {

        process.env.NEXTDEFAULT_PAGE && (
          window.location.href = process.env.NEXTDEFAULT_PAGE
        )

      }
    </>
  );
}
