import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_ID!,
});

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      currency = "INR",
      receipt,
      bookingId,
      notes,
    } = await req.json();

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: "Amount and bookingId are required" },
        { status: 400 }
      );
    }

    // Generate a shorter receipt ID to comply with Razorpay's 40-character limit
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const shortBookingId = bookingId.slice(-8); // Last 8 characters of booking ID
    const generatedReceipt = `rcpt_${shortBookingId}_${timestamp}`;

    const options = {
      amount: Math.round(amount * 100), // Amount in paisa
      currency,
      receipt: receipt || generatedReceipt,
      notes: {
        bookingId,
        ...notes,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { success: false, error: "Error creating order" },
      { status: 500 }
    );
  }
}
