import React from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Toaster } from "react-hot-toast";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}
