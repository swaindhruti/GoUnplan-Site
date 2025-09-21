import { FormFields } from "@/types/form";

export const CreateDestinationFormData: FormFields[] = [
  {
    label: "Trip Name",
    type: "text",
    id: "tripName",
    placeholder: "Enter the Trip Title",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "Destination",
    type: "text",
    id: "destination",
    placeholder: "nilgri waterfall",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "country",
    type: "text",
    id: "country",
    placeholder: "india",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "state",
    type: "text",
    id: "state",
    placeholder: "odisha",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "city",
    type: "text",
    id: "city",
    placeholder: "sambalpur",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "Price Per Person (INR)",
    type: "number",
    id: "price",
    placeholder: "14999",
    className: "col-span-1",
    zod: "number"
  },

  {
    label: "Pick Trip Vibe",
    type: "multi-select",
    id: "filters",
    placeholder: "Select a filter",
    options: [
      "Adventure",
      "Relaxation",
      "Culture",
      "Nature",
      "Nightlife",
      "Foodie",
      "Luxury",
      "Budget",
      "Wellness",
      "Family"
    ],
    className: "col-span-1",
    zod: "enum[]"
  },
  {
    label: "Start Date",
    type: "date",
    id: "startDate",
    placeholder: "Select Start Date",
    className: "col-span-1",
    zod: "date"
  },
  {
    label: "Number of Trip Days",
    type: "number",
    id: "noofdays",
    placeholder: "Enter Number of Days",
    className: "col-span-1",
    zod: "number"
  },
  {
    label: "Max Limit (People)",
    type: "number",
    id: "maxLimit",
    placeholder: "Select maximum",
    className: "col-span-1",
    zod: "number"
  },
  {
    label: "Description",
    type: "textarea",
    id: "description",
    placeholder: "Describe the trip details, highlights, and more...",
    className: "col-span-2",
    zod: "string"
  },
  {
    label: "Languages Offered",
    type: "multi-select",
    id: "languages",
    placeholder: "Select a language",
    options: ["English", "Hindi", "Spanish", "French"],
    className: "col-span-1",
    zod: "enum[]"
  },
  {
    label: "What's Included",
    type: "custom-input-list",
    id: "includedActivities",
    placeholder: "Add what's included (e.g., All meals, Transportation...)",
    className: "col-span-1",
    zod: "enum[]"
  },
  {
    label: "Not Included",
    type: "custom-input-list",
    id: "restrictions",
    placeholder:
      "Add what's not included (e.g., International flights, Personal expenses...)",
    className: "col-span-1",
    zod: "enum[]"
  },
  {
    label: "What's Special",
    type: "custom-input-list",
    id: "special",
    placeholder: "Add what's Special ",
    className: "col-span-1",
    zod: "enum[]"
  }
];
