import { getTripById } from '@/actions/trips/getTripByIdForPayment';
import { PaymentForm } from '@/components/booking/PaymentForm';
import { requireUser } from '@/lib/roleGaurd';
import { format } from 'date-fns';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    travelplanid: string;
    bookingId: string;
  }>;
  searchParams: Promise<{
    'payment-type'?: string;
  }>;
};

export default async function PaymentPage({ params, searchParams }: Props) {
  const tripId = (await params).travelplanid;
  const bookingId = (await params).bookingId;
  const { 'payment-type': paymentType } = await searchParams;

  const isPartialPayment = paymentType === 'partial-pay';
  const isRemainingPayment = paymentType === 'remaining-amount';

  try {
    const [{ trip, booking }, userSession] = await Promise.all([
      getTripById(tripId, bookingId),
      requireUser(),
    ]);

    if (!userSession) {
      redirect('/auth/signin');
    }

    if (!booking || !trip) {
      return notFound();
    }

    const startDate = booking.startDate;
    const endDate = booking.endDate;

    return (
      <>
        <PaymentForm
          booking={booking}
          bookingId={bookingId}
          paymentType={paymentType || 'full-pay'}
          isPartialPayment={isPartialPayment}
          isRemainingPayment={isRemainingPayment}
          userDetails={{
            name: userSession.user.name || 'Guest User',
            email: userSession.user.email || '',
            phone: userSession.user.phone || '',
          }}
          tripData={{
            ...trip,
            tripImage:
              trip?.tripImage ||
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
            pricePerPerson: trip?.price || 0,
            numberOfGuests: booking?.guests?.length,
            startDate: format(startDate, 'MMM dd, yyyy'),
            endDate: format(endDate, 'MMM dd, yyyy'),
          }}
        />
      </>
    );
  } catch (error) {
    console.error('Payment page error:', error);
    return notFound();
  }
}
