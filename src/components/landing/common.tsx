"use client";
import { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "../ui/carousel";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export const SectionLabel = ({ label }: { label: ReactNode }) => {
  return (
    <div
      className={`font-instrument inline-flex items-center px-8 py-2 ${
        label === "About Us" ? "bg-white" : "bg-purple-100"
      }  rounded-full`}
    >
      <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
};

export const PrimaryButton = ({
  label,
  type = "button",
  asContent = false
}: {
  label: string;
  type?: "button" | "submit" | "reset";
  asContent?: boolean;
}) => {
  const buttonContent = (
    <>
      {label}
      <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
    </>
  );

  if (asContent) {
    return (
      <div className="bg-purple-600 font-poppins text-white px-6 py-4 sm:px-12 sm:py-6 rounded-[90px] font-instrument font-semibold text-base sm:text-lg md:text-xl hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 sm:gap-3 group">
        {buttonContent}
      </div>
    );
  }

  return (
    <Button
      type={type}
      className="bg-purple-600 font-poppins text-white px-6 py-4 sm:px-12 sm:py-6 rounded-[90px] font-instrument font-semibold text-base sm:text-lg md:text-xl hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 sm:gap-3 group"
    >
      {buttonContent}
    </Button>
  );
};

type Destination = {
  id: number;
  name: string;
  country: string;
  image: string;
  price: string;
  description: string;
};

type Host = {
  id: number;
  name: string;
  description: string;
};

export const Carousels = ({
  SectionTitle,
  Description,
  type
}: {
  SectionTitle?: string;
  Description?: string;
  type?: "destinations" | "hosts";
}) => {
  const destinations: Destination[] = [
    {
      id: 1,
      name: "Spain",
      country: "France",
      image: "🗼",
      price: "2,499",
      description:
        "Explore the vibrant culture, stunning architecture, and delicious cuisine of Spain. From the bustling streets of Barcelona to the historic charm of Seville."
    },
    {
      id: 2,
      name: "Tokyo",
      country: "Japan",
      image: "🏯",
      price: "3,299",
      description:
        "Discover the perfect blend of traditional and modern Japan. Experience ancient temples, cutting-edge technology, and world-class cuisine."
    },
    {
      id: 3,
      name: "New York",
      country: "USA",
      image: "🗽",
      price: "1,899",
      description:
        "The city that never sleeps awaits you. From Broadway shows to world-class museums and iconic landmarks like the Statue of Liberty."
    },
    {
      id: 4,
      name: "London",
      country: "UK",
      image: "🏰",
      price: "2,199",
      description:
        "Immerse yourself in royal history, world-class museums, and charming pubs. Experience the perfect blend of tradition and modernity."
    },
    {
      id: 5,
      name: "Dubai",
      country: "UAE",
      image: "🏙️",
      price: "2,799",
      description:
        "Experience luxury like never before. From towering skyscrapers to pristine beaches and world-class shopping destinations."
    }
  ];

  const hosts: Host[] = [
    {
      id: 1,
      name: "Maria Rodriguez",
      description:
        "Expert local guide with 8 years of experience. Specializes in cultural tours and hidden gems. Fluent in English, Spanish, and French."
    },
    {
      id: 2,
      name: "Hiroshi Tanaka",
      description:
        "Tokyo native and certified tour guide. Passionate about sharing Japanese culture, history, and the best local food experiences."
    },
    {
      id: 3,
      name: "James Wilson",
      description:
        "New York local with extensive knowledge of the city's history, art scene, and best kept secrets. 10+ years guiding experience."
    },
    {
      id: 4,
      name: "Emma Thompson",
      description:
        "London historian and certified guide. Specializes in royal history, architecture, and traditional British culture experiences."
    },
    {
      id: 5,
      name: "Ahmed Al-Rashid",
      description:
        "Dubai local expert offering unique insights into Middle Eastern culture, modern architecture, and luxury experiences."
    }
  ];

  const data =
    type === "destinations"
      ? (destinations as Destination[])
      : (hosts as Host[]);

  return (
    <div className="h-auto md:min-h-screen flex justify-center items-center px-4 py-10 md:px-10">
      <div className="w-full max-w-6xl">
        <div className="mb-4 flex justify-center">
          <SectionLabel label={SectionTitle} />
        </div>
        <div className="mb-4 md:mb-20 text-center flex justify-center">
          <h2 className="text-xl font-bricolage sm:text-2xl w-[70%] md:text-5xl font-semibold text-gray-700 text-center">
            {Description}
          </h2>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full pb-20"
        >
          <CarouselContent className="-mx-6">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className={`px-6 basis-full sm:basis-1/2 ${
                  type === "hosts" ? "lg:basis-1/4" : "lg:basis-1/3"
                }`}
              >
                <div className="flex flex-col items-center">
                  <Card
                    className={`rounded-[90px] ${
                      type === "destinations"
                        ? "h-[50vh] w-full"
                        : "h-[40vh] w-full"
                    } relative shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer`}
                  >
                    <Image
                      src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
                      alt={type === "destinations" ? "Destination" : "Host"}
                      fill
                      className="object-cover rounded-[90px] transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <div className="text-white text-center">
                        <p className="text-sm md:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div
                    className={`${
                      type === "destinations"
                        ? "-mt-[100px] size-40"
                        : "-mt-[60px] size-30"
                    } z-30 rounded-full bg-purple-50 p-6 flex flex-col font-instrument items-center justify-center space-y-2 text-center`}
                  >
                    {type === "destinations" ? (
                      <>
                        <div className="flex items-center justify-center mt-2">
                          <Image
                            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752009257/Group_1_gbuwbu.svg"
                            alt="Rating Stars"
                            width={40}
                            height={20}
                          />
                        </div>
                        <SectionLabel label={(item as Destination).country} />
                        <h3 className="text-lg 2xl:text-xl font-semibold text-black">
                          {(item as Destination).name}
                        </h3>
                        <p className="text-gray-600 -mt-2 text-[14px] ">
                          ${(item as Destination).price}
                        </p>
                      </>
                    ) : (
                      <h3 className="text-lg font-normal text-black">
                        {(item as Host).name}
                      </h3>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};
