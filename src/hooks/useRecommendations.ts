// hooks/useRecommendations.ts
import { useMemo } from "react";

// Define proper types
export interface Trip {
  id: string;
  destination?: string;
  country?: string;
  region?: string;
  city?: string;
  continent?: string;
  vibe?: string;
  activities?: string[];
  tags?: string[];
  travellerType?: string;
  recommendedFor?: string;
  groupSize?: string;
  price?: number;
  language?: string;
  spokenLanguages?: string[];
  duration?: string;
  bestTime?: string;
  [key: string]: unknown; // For additional properties
}

export interface Filters {
  vibeFilter?: string[];
  travellerFilter?: string[];
  priceRange?: [number, number];
  searchTerm?: string;
  languageFilter?: string[];
  duration?: string;
  travelSeason?: string;
}

export interface RecommendationMatch {
  trip: Trip;
  score: number;
  reasons: string[];
}

export const useRecommendations = (filters: Filters, allTrips: Trip[]) => {
  const recommendations = useMemo(() => {
    if (!allTrips || allTrips.length === 0) return [];

    // Create scoring algorithm based on user's current filters
    const scoredTrips = allTrips.map((trip) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Vibe/Activity matching (40 points max)
      if (filters.vibeFilter && filters.vibeFilter.length > 0) {
        const vibeMatches = filters.vibeFilter.filter((vibe: string) => {
          const vibeMatch =
            trip.vibe?.toLowerCase().includes(vibe.toLowerCase()) ||
            trip.activities?.some((activity: string) =>
              activity.toLowerCase().includes(vibe.toLowerCase())
            ) ||
            trip.tags?.some((tag: string) =>
              tag.toLowerCase().includes(vibe.toLowerCase())
            );

          if (vibeMatch) {
            reasons.push(`Perfect for ${vibe} lovers`);
            return true;
          }
          return false;
        });

        score += vibeMatches.length * 40;
      }

      // 2. Group/Traveller type matching (35 points max)
      if (filters.travellerFilter && filters.travellerFilter.length > 0) {
        const groupMatches = filters.travellerFilter.filter((group: string) => {
          const groupMatch =
            trip.travellerType?.toLowerCase().includes(group.toLowerCase()) ||
            trip.recommendedFor?.toLowerCase().includes(group.toLowerCase()) ||
            trip.groupSize?.toLowerCase().includes(group.toLowerCase());

          if (groupMatch) {
            reasons.push(`Great for ${group}s`);
            return true;
          }
          return false;
        });

        score += groupMatches.length * 35;
      }

      // 3. Budget compatibility (25 points)
      if (trip.price && filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (trip.price >= minPrice && trip.price <= maxPrice) {
          score += 25;
          reasons.push("Within your budget");
        } else if (
          Math.abs(trip.price - (minPrice + maxPrice) / 2) <=
          (maxPrice - minPrice) * 0.3
        ) {
          // Close to budget range (within 30% of range)
          score += 15;
          reasons.push("Close to your budget");
        }
      }

      // 4. Geographic similarity (30 points)
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchTerms = filters.searchTerm.toLowerCase().split(" ");

        searchTerms.forEach((term: string) => {
          if (term.length > 2) {
            // Ignore very short terms
            const locationMatch =
              trip.destination?.toLowerCase().includes(term) ||
              trip.country?.toLowerCase().includes(term) ||
              trip.region?.toLowerCase().includes(term) ||
              trip.city?.toLowerCase().includes(term) ||
              trip.continent?.toLowerCase().includes(term);

            if (locationMatch) {
              score += 15;
              if (!reasons.includes("Similar destination")) {
                reasons.push("Similar destination");
              }
            }
          }
        });
      }

      // 5. Language preference (20 points)
      if (filters.languageFilter && filters.languageFilter.length > 0) {
        const languageMatches = filters.languageFilter.filter(
          (lang: string) =>
            trip.language?.toLowerCase().includes(lang.toLowerCase()) ||
            trip.spokenLanguages?.some((l: string) =>
              l.toLowerCase().includes(lang.toLowerCase())
            )
        );

        if (languageMatches.length > 0) {
          score += languageMatches.length * 20;
          reasons.push("Language-friendly");
        }
      }

      // 6. Duration similarity (15 points)
      if (trip.duration && filters.duration) {
        const durationMatch = trip.duration === filters.duration;
        if (durationMatch) {
          score += 15;
          reasons.push("Perfect duration");
        }
      }

      // 7. Seasonal/timing preferences (10 points)
      if (trip.bestTime && filters.travelSeason) {
        const seasonMatch = trip.bestTime
          .toLowerCase()
          .includes(filters.travelSeason.toLowerCase());
        if (seasonMatch) {
          score += 10;
          reasons.push("Great timing");
        }
      }

      return {
        ...trip,
        recommendationScore: score,
        matchReasons: reasons,
      };
    });

    // Filter and sort recommendations
    return scoredTrips
      .filter((trip) => trip.recommendationScore > 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }, [filters, allTrips]);

  // Get top N recommendations
  const getTopRecommendations = (n: number = 3): RecommendationMatch[] => {
    return recommendations.slice(0, n).map((trip) => ({
      trip,
      score: trip.recommendationScore,
      reasons: trip.matchReasons,
    }));
  };

  // Get recommendations by category
  const getRecommendationsByCategory = () => {
    const categories = {
      vibeMatches: recommendations
        .filter((trip) =>
          trip.matchReasons.some(
            (reason: string) =>
              reason.includes("lovers") || reason.includes("vibe")
          )
        )
        .slice(0, 2),

      groupMatches: recommendations
        .filter((trip) =>
          trip.matchReasons.some((reason: string) =>
            reason.includes("Great for")
          )
        )
        .slice(0, 2),

      budgetMatches: recommendations
        .filter((trip) =>
          trip.matchReasons.some((reason: string) => reason.includes("budget"))
        )
        .slice(0, 2),

      locationMatches: recommendations
        .filter((trip) =>
          trip.matchReasons.some(
            (reason: string) =>
              reason.includes("destination") || reason.includes("Similar")
          )
        )
        .slice(0, 2),
    };

    return categories;
  };

  // Check if user has specific preferences that we can match
  const hasMatchablePreferences = () => {
    return !!(
      (filters.vibeFilter && filters.vibeFilter.length > 0) ||
      (filters.travellerFilter && filters.travellerFilter.length > 0) ||
      (filters.searchTerm && filters.searchTerm.trim()) ||
      (filters.languageFilter && filters.languageFilter.length > 0) ||
      (filters.priceRange &&
        (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity))
    );
  };

  return {
    recommendations,
    getTopRecommendations,
    getRecommendationsByCategory,
    hasMatchablePreferences: hasMatchablePreferences(),
    totalRecommendations: recommendations.length,
  };
};
