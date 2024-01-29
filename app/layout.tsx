import "./globals.scss";
import "./styles.css";

import type { Metadata } from "next";
import AuthProvider from "./context/AuthProvider";
import ProtectRoutes from "./route/ProtectRoutes";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "Compliance Tool",
  description: "Compliance Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectRoutes>
            <Navbar />
            <Container>{children}</Container>
            <Toast />
          </ProtectRoutes>
        </AuthProvider>
      </body>
    </html>
  );
}
