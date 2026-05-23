import { JobEditor } from "@/components/admin/JobEditor";

export const metadata = { title: "New job" };

export default function NewJobPage() {
  return <JobEditor mode="create" />;
}
