import Link from "next/link";
import { ShieldCheckIcon } from "@/components/icons";

export function DisclaimerBar() {
  return (
    <div className="flex justify-center gap-20 bg-[#172B4D] px-4 py-1.75 text-xs text-[#CBD5E3]">
      <p className="flex items-center gap-1.5">
        <ShieldCheckIcon className="hidden h-3.75 w-3.75 shrink-0 text-amber sm:block" />
        <span>
          <b className="font-semibold text-white">Notice:</b> Careerwithkumar
          never charges any fee to apply for a job. Report suspicious posts
          immediately.
        </span>
      </p>
      <Link
        href="/contact"
        className="shrink-0 justify-items-end font-medium text-white hover:text-[#CBD5E3]"
      >
        Contact us
      </Link>
    </div>
  );
}
