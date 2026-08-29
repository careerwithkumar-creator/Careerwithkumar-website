import { ShieldCheckIcon, ClockIcon, UsersIcon, LockIcon } from "@/components/icons";

const ITEMS = [
  {
    icon: ShieldCheckIcon,
    iconClass: "bg-green-soft text-green",
    title: "Verified Updates",
    body: "We verify every update before publishing.",
  },
  {
    icon: ClockIcon,
    iconClass: "bg-amber-soft text-amber",
    title: "Fast Updates",
    body: "Get the latest job updates as soon as possible.",
  },
  {
    icon: UsersIcon,
    iconClass: "bg-blue-soft text-blue",
    title: "Trusted by Thousands",
    body: "Join thousands of job seekers across India.",
  },
  {
    icon: LockIcon,
    iconClass: "bg-purple-soft text-purple",
    title: "No Registration Fees",
    body: "We never charge any fee to apply for a job.",
  },
];

export function TrustStrip() {
  return (
    <div className="border-t border-border-soft bg-surface">
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-6 px-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, iconClass, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-text">{title}</p>
              <p className="mt-0.5 text-[12.5px] text-text-2">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
