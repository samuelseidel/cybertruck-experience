import ReservationWizard from "@/components/ReservationWizard";

export const metadata = {
  title: "Book a Ride · Cybertruck Experience",
  description: "Reserve your Cybertruck experience. Choose your city, date, and time.",
};

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; date?: string; time?: string }>;
}) {
  const params = await searchParams;
  return (
    <ReservationWizard
      initialCity={params.city}
      initialDate={params.date}
      initialTime={params.time}
    />
  );
}
