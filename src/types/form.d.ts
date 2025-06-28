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
    : K extends "filters" | "languages"
    ? string
    : string;
};

export type FormInputShape = {
  [K in FieldId]?: K extends "price" | "minLimit" | "maxLimit"
    ? string | number
    : K extends "startDate" | "endDate"
    ? string | Date
    : K extends "filters" | "languages"
    ? string
    : string;
};

export type FormSchemaType = z.ZodType<
  FormDataShape,
  z.ZodTypeDef,
  FormInputShape
>;

export interface FormComponentProps {
  FormData: FormFields[];
  FormSchema?: FormSchemaType;
}
