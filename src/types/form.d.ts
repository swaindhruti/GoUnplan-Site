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
  | "languages";

type ZodType = "string" | "number" | "enum" | "date";

type InputType = "text" | "number" | "select" | "textarea" | "date";

type BaseFormField = {
  label: string;
  type: InputType;
  id: FieldId;
  placeholder: string;
  className: string;
  zod: ZodType;
  options?: string[];
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
