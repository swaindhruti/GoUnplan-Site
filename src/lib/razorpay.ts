interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export async function createRazorpayOrder(
  amount: number,
  bookingId: string,
  notes?: Record<string, string>
) {
  try {
    const response = await fetch('/api/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        bookingId,
        notes,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

export async function verifyRazorpayPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  try {
    const response = await fetch('/api/verifyPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Payment verification failed');
    }

    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment({
  amount,
  bookingId,
  userDetails,
  tripTitle,
  onSuccess,
  onFailure,
}: {
  amount: number;
  bookingId: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  tripTitle: string;
  onSuccess: (paymentData: PaymentResponse) => Promise<void>;
  onFailure: (error: string) => void;
}) {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Create order
    const orderData = await createRazorpayOrder(amount, bookingId, {
      tripTitle,
      userEmail: userDetails.email,
    });

    const options: RazorpayOptions = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'GoUnplan',
      description: `Payment for ${tripTitle}`,
      order_id: orderData.order.id,
      handler: async function (response) {
        try {
          // Verify payment
          await verifyRazorpayPayment(response);
          await onSuccess(response);
        } catch (error) {
          console.error('Payment verification failed:', error);
          onFailure('Payment verification failed');
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: '#9333ea', // Purple theme matching your app
      },
      modal: {
        ondismiss: function () {
          onFailure('Payment cancelled by user');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error initiating Razorpay payment:', error);
    onFailure(error instanceof Error ? error.message : 'Payment initialization failed');
  }
}
