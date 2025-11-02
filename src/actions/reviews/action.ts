'use server';

import prisma from '@/lib/prisma';
import { requireUser } from '@/lib/roleGaurd';

export async function submitReview({
  userId,
  bookingId,
  rating,
  comment,
}: {
  userId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const session = await requireUser();
  if (!session || session.user.id !== userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
        status: 'CONFIRMED',
        isReviewed: false,
      },
      include: { travelPlan: true },
    });

    if (!booking) {
      return {
        success: false,
        message: 'Booking not found or already reviewed',
      };
    }

    const review = await prisma.$transaction(async tx => {
      const newReview = await tx.review.create({
        data: {
          userId,
          bookingId,
          travelPlanId: booking.travelPlanId,
          hostId: booking.travelPlan.hostId,
          rating,
          comment,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { isReviewed: true },
      });

      return newReview;
    });

    return { success: true, review };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}

export async function getTripReviewsAndRating(travelPlanId: string) {
  try {
    const travelPlan = await prisma.travelPlans.findUnique({
      where: { travelPlanId },
      select: {
        averageRating: true,
        reviewCount: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!travelPlan) {
      return { success: false, message: 'Travel plan not found' };
    }

    return {
      success: true,
      reviews: travelPlan.reviews,
      averageRating: travelPlan.averageRating,
      reviewCount: travelPlan.reviewCount,
    };
  } catch (error) {
    console.error('Error fetching trip reviews:', error);
    return { success: false, message: 'Failed to fetch reviews' };
  }
}

export async function getHostRatingAndReviews(hostId: string) {
  try {
    const host = await prisma.hostProfile.findUnique({
      where: { hostId },
      select: {
        averageRating: true,
        reviewCount: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
            travelPlan: {
              select: {
                title: true,
                destination: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!host) {
      return { success: false, message: 'Host not found' };
    }

    return {
      success: true,
      reviews: host.reviews,
      averageRating: host.averageRating,
      reviewCount: host.reviewCount,
    };
  } catch (error) {
    console.error('Error fetching host rating:', error);
    return { success: false, message: 'Failed to fetch host rating' };
  }
}

export async function getPendingReviewBookings(userId: string) {
  const session = await requireUser();
  if (!session || session.user.id !== userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        status: 'CONFIRMED',
        isReviewed: false,
        endDate: { lt: new Date() },
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        travelPlan: {
          select: {
            title: true,
            travelPlanId: true,
            destination: true,
            host: {
              select: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { endDate: 'desc' },
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return { success: false, message: 'Failed to fetch pending reviews' };
  }
}

export async function getUserReviews(userId: string) {
  const session = await requireUser();
  if (!session || session.user.id !== userId) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        booking: {
          select: {
            startDate: true,
            endDate: true,
          },
        },
        travelPlan: {
          select: {
            title: true,
            travelPlanId: true,
            destination: true,
            host: {
              select: {
                hostId: true,
                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      reviews,
      count: reviews.length,
      averageRating:
        reviews.length > 0
          ? Math.round(
              (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10
            ) / 10
          : 0,
    };
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return { success: false, message: 'Failed to fetch user reviews' };
  }
}
