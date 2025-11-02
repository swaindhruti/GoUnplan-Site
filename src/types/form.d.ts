type FieldId =
  | 'tripName'
  | 'destination'
  | 'country'
  | 'stops'
  | 'price'
  | 'commission'
  | 'filters'
  | 'startDate'
  | 'endDate'
  | 'maxLimit'
  | 'genderPreference'
  | 'description'
  | 'languages'
  | 'includedActivities'
  | 'restrictions'
  | 'special'
  | 'sectionhead'
  | 'noofdays'
  | 'dayWiseData';

type ZodType = 'string' | 'number' | 'enum' | 'date' | 'enum[]';

type DayWiseFieldId = 'title' | 'description' | 'meals' | 'accommodation';

type DayWiseFieldId = 'title' | 'description' | 'meals' | 'accommodation' | 'destination';

type InputType =
  | 'text'
  | 'number'
  | 'select'
  | 'textarea'
  | 'date'
  | 'multi-select'
  | 'inclusion-list'
  | 'exclusion-list'
  | 'custom-input-list'
  | 'sectionHead'
  | 'dynamic-group';

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
  [K in FieldId]?: K extends 'price' | 'maxLimit' | 'commission'
    ? number
    : K extends 'startDate' | 'endDate'
      ? Date
      : K extends 'filters' | 'languages' | 'includedActivities' | 'restrictions' | 'special'
        ? string[]
        : K extends 'tripImage'
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
  [K in FieldId]?: K extends 'price' | 'maxLimit' | 'commission'
    ? string | number
    : K extends 'startDate' | 'endDate'
      ? string | Date
      : K extends 'filters' | 'languages' | 'includedActivities' | 'restrictions' | 'special'
        ? string[]
        : K extends 'tripImage'
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

export type FormSchemaType = z.ZodType<FormDataShape, z.ZodTypeDef, FormInputShape>;

export interface FormComponentProps {
  FormData: FormFields[];
  FormSchema?: FormSchemaType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEditMode?: boolean;
}
