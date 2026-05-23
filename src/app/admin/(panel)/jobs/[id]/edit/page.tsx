import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobEditor } from "@/components/admin/JobEditor";

export const metadata = { title: "Edit job" };
export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <JobEditor
      mode="edit"
      initial={{
        id: job.id,
        slug: job.slug,
        title: job.title,
        department: job.department ?? "",
        location: job.location,
        employmentType: job.employmentType,
        salaryRange: job.salaryRange ?? "",
        shortDescription: job.shortDescription,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        niceToHave: job.niceToHave ?? "",
        status: job.status,
      }}
    />
  );
}
