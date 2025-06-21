export const CreateDestinationFormData = [
  {
    label: "Trip Name",
    type: "text" as const,
    id: "tripName" as const,
    placeholder: "Enter the Trip Title",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "Destination",
    type: "text" as const,
    id: "destination" as const,
    placeholder: "Hauz Khas, Delhi",
    className: "col-span-1",
    zod: "string"
  },
  {
    label: "Price (INR)",
    type: "number" as const,
    id: "price" as const,
    placeholder: "14999",
    className: "col-span-1",
    zod: "number"
  },
  {
    label: "Filter Tags",
    type: "select" as const,
    id: "filters" as const,
    placeholder: "Select a filter",
    options: ["Adventure", "Beach", "Historical", "Trekking", "Cultural"],
    className: "col-span-1",
    zod: "enum"
  },
  // {
  //   label: "Start Date",
  //   type: "date" as const,
  //   id: "startDate" as const,
  //   placeholder: "Select Start Date",
  //   className: "col-span-1",
  //   zod: "date"
  // },
  // {
  //   label: "End Date",
  //   type: "date" as const,
  //   id: "endDate" as const,
  //   placeholder: "Select End Date",
  //   className: "col-span-1",
  //   zod: "date"
  // },
  {
    label: "Min Limit (People)",
    type: "select" as const,
    id: "minLimit" as const,
    placeholder: "Select minimum",
    options: ["1", "2", "3", "4", "5"],
    className: "col-span-1",
    zod: "number"
  },
  {
    label: "Max Limit (People)",
    type: "select" as const,
    id: "maxLimit" as const,
    placeholder: "Select maximum",
    options: ["5", "10", "15", "20", "25", "30"],
    className: "col-span-1",
    zod: "number"
  },
  {
    label: "Description",
    type: "textarea" as const,
    id: "description" as const,
    placeholder: "Describe the trip details, highlights, and more...",
    className: "col-span-2",
    zod: "string"
  },
  {
    label: "Languages Offered",
    type: "select" as const,
    id: "languages" as const,
    placeholder: "Select a language",
    options: ["English", "Hindi", "Spanish", "French"],
    className: "col-span-1",
    zod: "enum"
  }
];
