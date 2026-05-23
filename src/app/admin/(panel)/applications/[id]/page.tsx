import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, ExternalLink, Calendar, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ApplicationActions } from "@/components/admin/ApplicationActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await prisma.application.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: a ? `${a.name} — Application` : "Application" };
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) notFound();

  return (
    <div className="px-6 py-10 md:px-10">
      <Link
        href="/admin/applications"
        data-cursor="link"
        className="group mb-3 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute hover:text-cream"
      >
        <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
        All applications
      </Link>

      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-2">— Application</div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            {application.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream-dim">
            <a
              href={`mailto:${application.email}`}
              className="inline-flex items-center gap-1.5 hover:text-cream"
            >
              <Mail size={12} className="text-gold" />
              {application.email}
            </a>
            {application.phone && (
              <a
                href={`tel:${application.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Phone size={12} className="text-gold" />
                {application.phone}
              </a>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} className="text-gold" />
              {application.createdAt.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Body */}
        <div className="space-y-8 lg:col-span-2">
          {/* Job */}
          <div className="rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-8">
            <div className="label-eyebrow mb-3">— Applied to</div>
            <Link
              href={`/admin/jobs/${application.jobId}/edit`}
              data-cursor="link"
              className="font-display text-xl tracking-tight hover:text-gold transition-colors md:text-2xl"
            >
              {application.job.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-dim">
              <span>{application.job.department ?? "—"}</span>
              <span className="text-cream-mute">·</span>
              <span>{application.job.location}</span>
              <span className="text-cream-mute">·</span>
              <span>{application.job.employmentType}</span>
            </div>
          </div>

          {/* Cover letter / notes */}
          {application.coverLetter && (
            <div className="rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-8">
              <div className="label-eyebrow mb-3">— What they said</div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-cream-dim md:text-base">
                {application.coverLetter}
              </pre>
            </div>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <div className="rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-8">
              <div className="label-eyebrow mb-3">— Resume</div>
              {/* Goes through the auth-gated proxy, not the raw Blob URL,
                  so the file stays private. */}
              <a
                href={`/api/admin/resume/${application.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 transition-colors hover:border-gold/60 hover:bg-gold/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText size={18} className="shrink-0 text-gold" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-cream group-hover:text-gold">
                      {application.resumeName ?? "Resume"}
                    </div>
                    {application.resumeSize && (
                      <div className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                        {(application.resumeSize / 1024).toFixed(0)} KB
                      </div>
                    )}
                  </div>
                </div>
                <Download
                  size={14}
                  className="shrink-0 text-cream-mute transition-colors group-hover:text-gold"
                />
              </a>
            </div>
          )}

          {/* Portfolio */}
          {application.portfolioLink && (
            <div className="rounded-3xl border border-cream-line bg-ink-2 p-6 md:p-8">
              <div className="label-eyebrow mb-3">— Links</div>
              <a
                href={application.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
              >
                <ExternalLink size={14} />
                {application.portfolioLink}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar — actions */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 rounded-3xl border border-cream-line bg-ink-2 p-6">
            <ApplicationActions
              id={application.id}
              status={application.status as any}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
