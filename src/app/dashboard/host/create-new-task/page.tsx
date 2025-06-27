"use client";
import { CreateDestinationForm } from "@/components/global/contactForm";
import { CreateDestinationFormData } from "@/config/form/formData/CreateDestinationData";
import { CreateDestinationSchema } from "@/config/form/formSchemaData/CreateDestinationSchema";

const CreateNewTask = () => {
  return (
    <>
      <CreateDestinationForm
        FormData={CreateDestinationFormData}
        FormSchema={CreateDestinationSchema}
      />
    </>
  );
};

export default CreateNewTask;
