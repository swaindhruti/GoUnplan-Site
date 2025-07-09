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
    <>
      <div
        className={`font-montserrat inline-flex items-center px-8 py-2 ${
          label === "About Us" ? "bg-white" : "bg-purple-100"
        }  rounded-full`}
      >
        <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
    </>
  );
};

export const FindPackagesButton = ({ label }: { label: string }) => {
  return (
    <Button
      className="bg-purple-500  font-poppins hover:bg-purple-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      size="lg"
    >
      {label}
      <ArrowRight className="ml-2 h-5 w-5" />
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
          <h2 className="text-xl font-playfair sm:text-2xl w-[70%] md:text-5xl font-semibold text-gray-700 text-center">
            {Description}
          </h2>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full pb-20"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="flex flex-col items-center">
                  <Card
                    className={`rounded-[90px] ${
                      type === "destinations"
                        ? "h-[60vh] w-full"
                        : "h-[40vh] w-[70%]"
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
                        ? "-mt-[100px] size-50"
                        : "-mt-[60px] size-30"
                    } z-30 rounded-full bg-white p-6 flex flex-col font-roboto items-center justify-center space-y-3 text-center`}
                  >
                    {type === "destinations" ? (
                      <>
                        <div className="flex items-center justify-center">
                          <Image
                            src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1752009257/Group_1_gbuwbu.svg"
                            alt="Rating Stars"
                            width={60}
                            height={20}
                          />
                        </div>
                        <SectionLabel label={(item as Destination).country} />
                        <h3 className="text-xl font-semibold text-black">
                          {(item as Destination).name}
                        </h3>
                        <p className="text-gray-600 -mt-2 text-base">
                          ${(item as Destination).price}
                        </p>
                      </>
                    ) : (
                      <h3 className="text-lg font-normal md:font-medium text-black">
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
