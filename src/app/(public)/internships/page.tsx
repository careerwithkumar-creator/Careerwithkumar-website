import JobsPage from "../jobs/page";
export const metadata = {
  title: "Internships | CareerWithKumar",
  alternates: { canonical: "/internships" },
  description:
    "Browse published internships and verify eligibility on official employer websites.",
};
export default function Internships() {
  return (
    <JobsPage searchParams={Promise.resolve({ category: "internship" })} />
  );
}
