"use client";
import { CreateDestinationForm } from "@/components/global/contactForm";
import { CreateDestinationFormData } from "@/config/form/formData/CreateDestinationData";
import { CreateDestinationSchema } from "@/config/form/formSchemaData/CreateDestinationSchema";
import { getTripById } from "@/actions/host/action";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const CreateNewTask = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const [initialData, setInitialData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(!!tripId);

  useEffect(() => {
    const fetchTripData = async () => {
      if (tripId) {
        try {
          const tripData = await getTripById(tripId);
          if (!("error" in tripData)) {
            setInitialData(tripData);
          }
        } catch (error) {
          console.error("Error fetching trip data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTripData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 font-instrument">
            Loading trip data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <CreateDestinationForm
        FormData={CreateDestinationFormData}
        FormSchema={CreateDestinationSchema}
        initialData={initialData}
        isEditMode={!!tripId}
      />
    </>
  );
};

export default CreateNewTask;
