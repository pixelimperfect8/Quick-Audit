import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";

export default function SidebarOption1Page() {
  return (
    <>
      <Dashboard backHref="/sidebar-improvements" backLabel="Sidebar Improvements" />
      <DesignSystemViewer />
    </>
  );
}
