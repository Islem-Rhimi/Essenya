import AuthGuard from "./auth-guard";
import Sidebar from "~/components/blocs/layout/Sidebar";
import MobileSidebar from "~/components/blocs/layout/MobileSidebar";
import Navbar from "~/components/blocs/layout/Navbar";
import { SessionTypeGuard } from "./session-type-guard";
interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <SessionTypeGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileSidebar />

          <div className="ml-0 flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1 bg-[#f0fbf8] dark:bg-[#18202f]">
              {children}
            </main>
          </div>
        </div>
      </SessionTypeGuard>
    </AuthGuard>
  );
};
