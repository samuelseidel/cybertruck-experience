import VoucherWizard from "@/components/VoucherWizard";

export const metadata = {
  title: "Buy a Gift Voucher · Cybertruck Experience",
  description: "Give the Cybertruck experience as a gift. Choose your package and send it instantly by email.",
};

export default async function VoucherPage({
  searchParams,
}: {
  searchParams: Promise<{ pkg?: string }>;
}) {
  const params = await searchParams;
  return <VoucherWizard initialPkg={params.pkg} />;
}
