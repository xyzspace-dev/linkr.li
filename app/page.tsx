"use client";

export default function Home() {
  return (
    <>
      {

        process.env.NEXTDEFAULT_PAGE && (
          window.open(process.env.NEXTDEFAULT_PAGE)
        )

      }
    </>
  );
}
