import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";

export default function KeyFileDataPage() {
  return (
    <>
      <Dashboard backHref="/" backLabel="Quick Audit" />
      <DesignSystemViewer />
    </>
  );
}
