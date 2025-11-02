import { prisma, requireUser } from '@/lib/shared';

interface SearchContext {
  searchTerm?: string;
  vibeFilter?: string[];
  travellerFilter?: string[];
  priceRange?: [number, number];
  selectedCountries?: string[];
  selectedStates?: string[];
  selectedCities?: string[];
  languageFilter?: string[];
}

interface TripData {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  languages: string[];
  filters: string[];
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: Date;
  destination?: string | null;
  averageRating: number;
  reviewCount: number;
  bookings: { id: string }[];
}

interface TripWithScore extends TripData {
  score: number;
}

export const getSuggestedTrips = async (context: SearchContext, limit: number = 8) => {
  const session = await requireUser();
  if (!session) return { error: 'Unauthorized' };

  try {
    // Get all active trips with additional data for scoring
    const allTrips = await prisma.travelPlans.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        travelPlanId: true,
        title: true,
        description: true,
        country: true,
        state: true,
        city: true,
        languages: true,
        filters: true,
        noOfDays: true,
        price: true,
        hostId: true,
        createdAt: true,
        destination: true,
        averageRating: true,
        reviewCount: true,
        bookings: {
          where: {
            status: 'CONFIRMED',
            createdAt: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
            },
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate similarity scores for each trip
    const tripsWithScores: TripWithScore[] = allTrips.map(trip => ({
      ...trip,
      score: calculateSimilarityScore(trip, context),
    }));

    // Sort by score (highest first) and take top results
    const suggestedTrips = tripsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, bookings, ...trip }) => {
        // Explicitly ignore unused variables
        void score;
        void bookings;
        return trip;
      }); // Remove score and bookings from response

    return {
      success: true,
      trips: suggestedTrips,
      totalFound: tripsWithScores.length,
    };
  } catch (error) {
    console.error('Error fetching suggested trips:', error);
    return { error: 'Failed to fetch suggested trips' };
  }
};

function calculateSimilarityScore(trip: TripData, context: SearchContext): number {
  let score = 0;

  // 1. Location Similarity (30 points max)
  score += calculateLocationScore(trip, context);

  // 2. Activity/Vibe Match (25 points max)
  score += calculateVibeScore(trip, context);

  // 3. Trip Characteristics (20 points max)
  score += calculateCharacteristicsScore(trip, context);

  // 4. Popularity Boost (15 points max)
  score += calculatePopularityScore(trip);

  // 5. User Preferences (10 points max)
  score += calculatePreferencesScore(trip, context);

  return Math.round(score);
}

function calculateLocationScore(trip: TripData, context: SearchContext): number {
  let score = 0;
  const searchTerm = context.searchTerm?.toLowerCase() || '';

  if (!searchTerm) return score;

  // Exact matches
  if (trip.city.toLowerCase().includes(searchTerm)) score += 30;
  else if (trip.state.toLowerCase().includes(searchTerm)) score += 20;
  else if (trip.country.toLowerCase().includes(searchTerm)) score += 15;
  else if (trip.destination?.toLowerCase().includes(searchTerm)) score += 25;

  // Partial matches in title/description
  if (trip.title.toLowerCase().includes(searchTerm)) score += 10;
  if (trip.description.toLowerCase().includes(searchTerm)) score += 5;

  // Filter-based location matches
  if (context.selectedCities?.some(city => trip.city.toLowerCase().includes(city.toLowerCase())))
    score += 20;

  if (context.selectedStates?.some(state => trip.state.toLowerCase().includes(state.toLowerCase())))
    score += 15;

  if (
    context.selectedCountries?.some(country =>
      trip.country.toLowerCase().includes(country.toLowerCase())
    )
  )
    score += 10;

  return Math.min(score, 30); // Cap at 30 points
}

function calculateVibeScore(trip: TripData, context: SearchContext): number {
  let score = 0;

  // Direct vibe filter matches
  if (context.vibeFilter && context.vibeFilter.length > 0) {
    const matchingVibes = trip.filters.filter((filter: string) =>
      context.vibeFilter!.some(
        vibe =>
          filter.toLowerCase().includes(vibe.toLowerCase()) ||
          vibe.toLowerCase().includes(filter.toLowerCase())
      )
    );
    score += Math.min(matchingVibes.length * 5, 25);
  }

  // Keyword matching in description for vibes
  const searchTerm = context.searchTerm?.toLowerCase() || '';
  if (searchTerm) {
    const vibeKeywords = {
      adventure: ['adventure', 'trek', 'hike', 'climb', 'extreme', 'thrill'],
      cultural: ['culture', 'temple', 'museum', 'heritage', 'history', 'tradition'],
      nature: ['nature', 'forest', 'mountain', 'wildlife', 'national park'],
      relaxation: ['beach', 'relax', 'spa', 'peaceful', 'serene', 'calm'],
      luxury: ['luxury', 'premium', 'five star', 'resort', 'villa'],
      budget: ['budget', 'cheap', 'affordable', 'backpack', 'hostel'],
    };

    Object.entries(vibeKeywords).forEach(([vibe, keywords]) => {
      if (keywords.some(keyword => searchTerm.includes(keyword))) {
        if (trip.filters.some((filter: string) => filter.toLowerCase().includes(vibe))) {
          score += 15;
        }
      }
    });
  }

  return Math.min(score, 25); // Cap at 25 points
}

function calculateCharacteristicsScore(trip: TripData, context: SearchContext): number {
  let score = 0;

  // Price range similarity
  if (context.priceRange && context.priceRange[0] > 0) {
    const [minPrice, maxPrice] = context.priceRange;
    const avgSearchPrice = (minPrice + maxPrice) / 2;
    const priceDifference = Math.abs(trip.price - avgSearchPrice) / avgSearchPrice;

    if (priceDifference <= 0.3)
      score += 10; // Within 30%
    else if (priceDifference <= 0.5) score += 5; // Within 50%
  }

  // Duration preferences (if we can infer from search)
  const searchTerm = context.searchTerm?.toLowerCase() || '';
  if (searchTerm.includes('weekend') && trip.noOfDays <= 3) score += 10;
  else if (searchTerm.includes('week') && trip.noOfDays >= 5 && trip.noOfDays <= 10) score += 10;
  else if (searchTerm.includes('long') && trip.noOfDays > 10) score += 10;

  return Math.min(score, 20); // Cap at 20 points
}

function calculatePopularityScore(trip: TripData): number {
  let score = 0;

  // High ratings boost
  if (trip.averageRating >= 4.5) score += 10;
  else if (trip.averageRating >= 4.0) score += 7;
  else if (trip.averageRating >= 3.5) score += 3;

  // Recent bookings boost
  if (trip.bookings && trip.bookings.length > 0) {
    score += Math.min(trip.bookings.length * 2, 5);
  }

  return Math.min(score, 15); // Cap at 15 points
}

function calculatePreferencesScore(trip: TripData, context: SearchContext): number {
  let score = 0;

  // Traveller type matches
  if (context.travellerFilter && context.travellerFilter.length > 0) {
    // This would require adding traveller type to trip filters
    // For now, we'll use description matching
    const description = trip.description.toLowerCase();
    context.travellerFilter.forEach(type => {
      const typeKeywords = {
        Solo: ['solo', 'individual', 'self'],
        Couple: ['couple', 'romantic', 'honeymoon'],
        Family: ['family', 'kids', 'children'],
        Friends: ['friends', 'group', 'gang'],
        Business: ['business', 'corporate', 'professional'],
      };

      const keywords = typeKeywords[type as keyof typeof typeKeywords] || [];
      if (keywords.some(keyword => description.includes(keyword))) {
        score += 3;
      }
    });
  }

  // Language preferences
  if (context.languageFilter && context.languageFilter.length > 0) {
    const matchingLanguages = trip.languages.filter((lang: string) =>
      context.languageFilter!.includes(lang)
    );
    score += matchingLanguages.length * 2;
  }

  return Math.min(score, 10); // Cap at 10 points
}
