import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES: Record<string, number> = {
  discovery: 14900,
  full:      24900,
  elite:     49900,
};

const LABELS: Record<string, { name: string; duration: string }> = {
  discovery: { name: "Discovery",  duration: "30 min" },
  full:      { name: "Full Power", duration: "60 min" },
  elite:     { name: "Elite",      duration: "120 min" },
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  try {
    const body = await req.json();
    const { cityId, city, address, dateLabel, dateIso, time, package: pkg, firstName, lastName, email, phone } = body;

    if (!pkg || !PRICES[pkg]) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }
    if (!email || !firstName || !lastName || !dateIso || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const label   = LABELS[pkg];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Cybertruck ${label.name} Experience`,
            description: `${label.duration} · ${city} · ${dateLabel} at ${time}`,
          },
          unit_amount: PRICES[pkg],
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: email,
      success_url: `${baseUrl}/reserve/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/reserve`,
      metadata: {
        type:       "booking",
        pkg,
        cityId:     (cityId    || "").substring(0, 490),
        city:       (city      || "").substring(0, 490),
        address:    (address   || "").substring(0, 490),
        dateLabel:  (dateLabel || "").substring(0, 490),
        dateIso:    (dateIso   || "").substring(0, 490),
        time:       (time      || "").substring(0, 490),
        firstName:  (firstName || "").substring(0, 490),
        lastName:   (lastName  || "").substring(0, 490),
        email:      (email     || "").substring(0, 490),
        phone:      (phone     || "").substring(0, 490),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Booking checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
