import { Suspense } from "react";
import BookingSuccess from "@/components/BookingSuccess";

export default async function ReserveSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", border: "2px solid rgba(62,106,225,0.3)", borderTopColor: "var(--tesla-blue)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
      </div>
    }>
      <BookingSuccess sessionId={params.session_id} />
    </Suspense>
  );
}
