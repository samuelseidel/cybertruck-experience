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
    const { pkg, isGift, recipientName, recipientEmail, giftMessage, senderName, senderLastName, senderEmail, phone } = body;

    if (!pkg || !PRICES[pkg]) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const label  = LABELS[pkg];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Cybertruck ${label.name} Experience`,
            description: isGift
              ? `${label.duration} experience · Gift voucher for ${recipientName}`
              : `${label.duration} experience voucher`,
          },
          unit_amount: PRICES[pkg],
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: senderEmail || undefined,
      success_url: `${baseUrl}/voucher/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/voucher`,
      metadata: {
        pkg,
        isGift:        isGift ? "true" : "false",
        recipientName: (recipientName  || "").substring(0, 490),
        recipientEmail:(recipientEmail || "").substring(0, 490),
        giftMessage:   (giftMessage    || "").substring(0, 490),
        senderName:    (senderName     || "").substring(0, 490),
        senderLastName:(senderLastName || "").substring(0, 490),
        senderEmail:   (senderEmail    || "").substring(0, 490),
        phone:         (phone          || "").substring(0, 490),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
