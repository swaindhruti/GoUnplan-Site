export type RawTrip = {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: string | Date;
  languages?: string[];
  filters?: string[];
};

export type Trip = {
  travelPlanId: string;
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  noOfDays: number;
  price: number;
  hostId: string;
  createdAt: string;
  languages: string[];
  filters: string[];
  vibes: string[];
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FilterState = {
  searchTerm: string;
  priceRange: [number, number];
  daysFilter: string;
  countryFilter: string;
  languageFilter: string[];
  vibeFilter: string[];
};

export const INITIAL_FILTERS: FilterState = {
  searchTerm: "",
  priceRange: [0, Infinity],
  daysFilter: "all",
  countryFilter: "all",
  languageFilter: [],
  vibeFilter: [],
};

export const DURATION_OPTIONS = [
  { value: "all", label: "All Durations" },
  { value: "1-3", label: "Short Trip (1–3 Days)" },
  { value: "4-7", label: "Medium Trip (4–7 Days)" },
  { value: "8", label: "Extended Trip (8+ Days)" },
];
