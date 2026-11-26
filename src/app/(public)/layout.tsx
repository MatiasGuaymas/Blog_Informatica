import ClientOnlyEdgeSwipe from "@/components/ClientOnlyEdgeSwipe";
import ClientOnlyMobileSidebarProvider from "@/components/ClientOnlyMobileSidebarProvider";
import ClientOnlySidebar from "@/components/ClientOnlySidebar";
import Header from "@/components/Header";

const APP_NAME = "Blog Informática";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClientOnlyMobileSidebarProvider>
      <div className="flex min-h-screen w-full">
        <ClientOnlySidebar appName={APP_NAME} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
            {children}
          </main>
        </div>
      </div>
      <ClientOnlyEdgeSwipe />
    </ClientOnlyMobileSidebarProvider>
  );
}
