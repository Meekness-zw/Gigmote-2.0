import { ComingSoon } from "@/components/sections/ComingSoon";

export default function NotFound() {
  return (
    <ComingSoon
      eyebrow="404"
      title="That page didn't make the cut."
      description="The route you followed doesn't exist (yet). The site is currently being rebuilt — most inner pages return in Phase 3."
    />
  );
}
