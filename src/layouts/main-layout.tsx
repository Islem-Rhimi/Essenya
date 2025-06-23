import { Children } from "react";
// import AuthGuard from "./auth-guard";
import Sidebar from "~/components/blocs/layout/Sidebar";
import MobileSidebar from "~/components/blocs/layout/MobileSidebar";
import Navbar from "~/components/blocs/layout/Navbar";
import Footer from "~/components/blocs/landing/Footer";
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    // <AuthGuard>
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileSidebar />

      <div className="bg-background ml-0 flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
    // </AuthGuard>
  );
};
