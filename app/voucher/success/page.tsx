import { Suspense } from "react";
import VoucherSuccess from "@/components/VoucherSuccess";

export const metadata = {
  title: "Voucher Ready · Cybertruck Experience",
};

export default function VoucherSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100svh", background: "var(--bg-dark)" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(62,106,225,0.2)", borderTopColor: "var(--tesla-blue)", animation: "spin 0.75s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <VoucherSuccess />
    </Suspense>
  );
}
