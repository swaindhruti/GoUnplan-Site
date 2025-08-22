type FieldId =
  | "tripName"
  | "destination"
  | "country"
  | "state"
  | "city"
  | "price"
  | "filters"
  | "startDate"
  | "endDate"
  | "minLimit"
  | "maxLimit"
  | "description"
  | "languages"
  | "includedActivities"
  | "restrictions"
  | "sectionhead"
  | "dayWiseData";

type ZodType = "string" | "number" | "enum" | "date" | "enum[]";

type DayWiseFieldId = "title" | "description" | "meals" | "accommodation";

type InputType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "date"
  | "multi-select"
  | "sectionHead"
  | "dynamic-group";

type GroupFieldTypes = {
  label: string;
  type: InputType;
  id: DayWiseFieldId;
  placeholder?: string;
  className: string;
  zod: string;
};

type BaseFormField = {
  label: string;
  type: InputType;
  id: FieldId;
  placeholder?: string;
  className: string;
  zod: ZodType;
  options?: string[];
  groupFields?: GroupFieldTypes[];
};

export type FormFields = BaseFormField;

export type FormDataShape = {
  [K in FieldId]?: K extends "price" | "minLimit" | "maxLimit"
    ? number
    : K extends "startDate" | "endDate"
    ? Date
    : K extends "filters" | "languages" | "includedActivities" | "restrictions"
    ? string[]
    : K extends "tripImage"
    ? string // tripImage is now required
    : string;
} & {
  // Make tripImage required in the shape
  tripImage: string;
  dayWiseData: Array<{
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
    meals: string;
    accommodation: string;
    dayWiseImage: string; // Make day-wise images required
  }>;
};

export type FormInputShape = {
  [K in FieldId]?: K extends "price" | "minLimit" | "maxLimit"
    ? string | number
    : K extends "startDate" | "endDate"
    ? string | Date
    : K extends "filters" | "languages" | "includedActivities" | "restrictions"
    ? string[]
    : K extends "tripImage"
    ? string
    : string;
} & {
  tripImage: string;
  dayWiseData: Array<{
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
    meals: string;
    accommodation: string;
    dayWiseImage: string;
  }>;
};

export type FormSchemaType = z.ZodType<
  FormDataShape,
  z.ZodTypeDef,
  FormInputShape
>;

export interface FormComponentProps {
  FormData: FormFields[];
  FormSchema?: FormSchemaType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEditMode?: boolean;
}
