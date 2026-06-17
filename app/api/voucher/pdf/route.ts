import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import crypto from "crypto";

const PKG: Record<string, { name: string; duration: string; price: string; features: string[] }> = {
  discovery: {
    name: "Discovery", duration: "30 Minutes", price: "€149",
    features: ["30-minute drive with instructor", "City route experience", "Full acceleration run", "Digital photo package"],
  },
  full: {
    name: "Full Power", duration: "60 Minutes", price: "€249",
    features: ["60-minute drive with instructor", "Highway + city route", "Full performance demo", "Professional photo set", "Cybertruck keepsake"],
  },
  elite: {
    name: "Elite", duration: "120 Minutes", price: "€499",
    features: ["120-minute private session", "Custom route selection", "Pro photo + video package", "Merchandise kit", "Dedicated host"],
  },
};

function voucherCode(sessionId: string): string {
  const hash = crypto.createHash("sha256").update(sessionId).digest("hex").toUpperCase();
  return `CT-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
}

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

    const meta    = session.metadata!;
    const pkg     = PKG[meta.pkg] || PKG.discovery;
    const code    = voucherCode(sessionId);
    const isGift  = meta.isGift === "true";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cybertruck-nine.vercel.app";

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const validStr = validUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    // QR code encodes voucher verification URL
    const qrPng = await QRCode.toBuffer(`${baseUrl}/verify?v=${code}`, {
      width: 220, margin: 1,
      color: { dark: "#0d0d0f", light: "#ffffff" },
    });

    // ── Build PDF ──────────────────────────────────────────────────

    const doc  = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4 portrait
    const W    = page.getWidth();
    const H    = page.getHeight();

    const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
    const regular = await doc.embedFont(StandardFonts.Helvetica);

    const blue   = rgb(0.243, 0.416, 0.882);
    const black  = rgb(0.051, 0.051, 0.059);
    const mid    = rgb(0.25,  0.25,  0.25);
    const grayC  = rgb(0.55,  0.55,  0.55);
    const hairline = rgb(0.88, 0.88, 0.88);

    // Background
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 1, 1) });

    // Top accent bar
    page.drawRectangle({ x: 0, y: H - 7, width: W, height: 7, color: blue });

    // Wordmark
    page.drawText("CYBERTRUCK", {
      x: 52, y: H - 62, size: 30, font: bold, color: black,     });
    page.drawText("EXPERIENCE VOUCHER", {
      x: 52, y: H - 84, size: 9.5, font: regular, color: grayC,
    });

    // Horizontal rule
    page.drawLine({ start: { x: 52, y: H - 104 }, end: { x: W - 52, y: H - 104 }, thickness: 0.75, color: hairline });

    // Package name
    page.drawText(pkg.name, {
      x: 52, y: H - 152, size: 44, font: bold, color: black,
    });
    page.drawText(pkg.duration.toUpperCase(), {
      x: 52, y: H - 180, size: 9, font: regular, color: grayC,
    });

    // Price
    page.drawText(pkg.price, {
      x: 52, y: H - 236, size: 56, font: bold, color: blue,
    });

    // Features list
    page.drawText("WHAT'S INCLUDED", {
      x: 52, y: H - 300, size: 7.5, font: bold, color: grayC,
    });
    pkg.features.forEach((f, i) => {
      page.drawText(`·   ${f}`, {
        x: 56, y: H - 320 - i * 19, size: 10, font: regular, color: mid,
      });
    });

    // ── QR code (right column) ──────────────────────────────────
    const qrImg  = await doc.embedPng(qrPng);
    const qrSize = 128;
    const qrX    = W - 52 - qrSize;
    const qrY    = H - 290;

    page.drawRectangle({ x: qrX - 8, y: qrY - 8, width: qrSize + 16, height: qrSize + 16, color: rgb(0.97, 0.97, 0.97) });
    page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });
    page.drawText("Scan to verify", {
      x: qrX + 18, y: qrY - 18, size: 8, font: regular, color: grayC,
    });

    // ── Divider ─────────────────────────────────────────────────
    const divY = H - 468;
    page.drawLine({ start: { x: 52, y: divY }, end: { x: W - 52, y: divY }, thickness: 0.75, color: hairline });

    // Voucher code
    page.drawText("VOUCHER CODE", {
      x: 52, y: divY - 26, size: 7.5, font: bold, color: grayC,
    });
    page.drawText(code, {
      x: 52, y: divY - 46, size: 18, font: bold, color: black,
    });

    // Valid until
    page.drawText("VALID UNTIL", {
      x: 300, y: divY - 26, size: 7.5, font: bold, color: grayC,
    });
    page.drawText(validStr, {
      x: 300, y: divY - 46, size: 12, font: regular, color: mid,
    });

    // ── Gift / recipient ─────────────────────────────────────────
    if (isGift && meta.recipientName) {
      const gY = divY - 84;
      page.drawLine({ start: { x: 52, y: gY + 14 }, end: { x: W - 52, y: gY + 14 }, thickness: 0.75, color: hairline });

      page.drawText("GIFTED TO", {
        x: 52, y: gY - 4, size: 7.5, font: bold, color: grayC,
      });
      page.drawText(meta.recipientName, {
        x: 52, y: gY - 22, size: 14, font: bold, color: black,
      });

      if (meta.giftMessage) {
        // Simple single-line truncation
        const msg = meta.giftMessage.length > 72 ? `${meta.giftMessage.slice(0, 72)}…` : meta.giftMessage;
        page.drawText(`"${msg}"`, {
          x: 56, y: gY - 42, size: 10, font: regular, color: grayC,
        });
      }

      page.drawText("FROM", {
        x: 340, y: gY - 4, size: 7.5, font: bold, color: grayC,
      });
      page.drawText(meta.senderName || "", {
        x: 340, y: gY - 22, size: 13, font: bold, color: black,
      });
      page.drawText(meta.senderEmail || "", {
        x: 340, y: gY - 40, size: 9, font: regular, color: mid,
      });
    }

    // ── Footer ───────────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: 0, width: W, height: 52, color: rgb(0.96, 0.96, 0.96) });
    page.drawText("Valid at any Czech Republic tour stop  ·  Redeemable Jul – Aug 2026  ·  Insurance included", {
      x: 52, y: 30, size: 8.5, font: regular, color: mid,
    });
    page.drawText("Cybertruck Experience  ·  Not affiliated with Tesla, Inc.", {
      x: 52, y: 14, size: 7.5, font: regular, color: grayC,
    });

    const pdfBytes = await doc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="cybertruck-voucher-${code}.pdf"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate voucher" }, { status: 500 });
  }
}
