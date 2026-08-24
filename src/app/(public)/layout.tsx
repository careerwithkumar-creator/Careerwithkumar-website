import { DisclaimerBar } from "@/components/disclaimer-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PresenceHeartbeat } from "@/components/presence-heartbeat";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PresenceHeartbeat />
      <DisclaimerBar />
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </>
  );
}
