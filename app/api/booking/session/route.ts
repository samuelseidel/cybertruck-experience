import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const meta = session.metadata!;
    const hash = crypto.createHash("sha256").update(sessionId).digest("hex").toUpperCase();
    const ref  = `CT-${hash.slice(0, 4)}-${hash.slice(4, 8)}`;

    return NextResponse.json({
      ref,
      pkg:       meta.pkg,
      city:      meta.city,
      address:   meta.address,
      dateLabel: meta.dateLabel,
      time:      meta.time,
      firstName: meta.firstName,
      email:     meta.email,
    });
  } catch (err) {
    console.error("Booking session error:", err);
    return NextResponse.json({ error: "Failed to retrieve booking" }, { status: 500 });
  }
}
