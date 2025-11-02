'use client';
import { ReactNode } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import Marquee from 'react-fast-marquee';

export const SectionLabel = ({ label }: { label: ReactNode }) => {
  return (
    <div
      className={`font-instrument inline-flex items-center px-8 py-2 ${
        label === 'About Us' ? 'bg-white' : 'bg-purple-100'
      }  rounded-full`}
    >
      <span className="text-purple-600 text-sm font-semibold tracking-wide uppercase">{label}</span>
    </div>
  );
};

export const PrimaryButton = ({
  label,
  type = 'button',
  asContent = false,
}: {
  label: string;
  type?: 'button' | 'submit' | 'reset';
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
      <div className="bg-purple-600 font-poppins text-white px-6 py-4 sm:px-12 sm:py-6 rounded-[90px] font-instrument font-semibold text-base sm:text-lg md:text-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-1 group">
        {buttonContent}
      </div>
    );
  }

  return (
    <Button
      type={type}
      className="bg-purple-600 font-poppins text-white px-6 py-4 sm:px-12 sm:py-6 rounded-[90px] font-instrument font-semibold text-base sm:text-lg md:text-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-1 group"
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
  type,
}: {
  SectionTitle?: string;
  Description?: string;
  type?: 'destinations' | 'hosts';
}) => {
  const destinations: Destination[] = [
    {
      id: 1,
      name: 'Spain',
      country: 'France',
      image: '🗼',
      price: '2,499',
      description:
        'Explore the vibrant culture, stunning architecture, and delicious cuisine of Spain. From the bustling streets of Barcelona to the historic charm of Seville.',
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      image: '🏯',
      price: '3,299',
      description:
        'Discover the perfect blend of traditional and modern Japan. Experience ancient temples, cutting-edge technology, and world-class cuisine.',
    },
    {
      id: 3,
      name: 'New York',
      country: 'USA',
      image: '🗽',
      price: '1,899',
      description:
        'The city that never sleeps awaits you. From Broadway shows to world-class museums and iconic landmarks like the Statue of Liberty.',
    },
    {
      id: 4,
      name: 'London',
      country: 'UK',
      image: '🏰',
      price: '2,199',
      description:
        'Immerse yourself in royal history, world-class museums, and charming pubs. Experience the perfect blend of tradition and modernity.',
    },
    {
      id: 5,
      name: 'Dubai',
      country: 'UAE',
      image: '🏙️',
      price: '2,799',
      description:
        'Experience luxury like never before. From towering skyscrapers to pristine beaches and world-class shopping destinations.',
    },
  ];

  const hosts: Host[] = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      description:
        'Expert local guide with 8 years of experience. Specializes in cultural tours and hidden gems. Fluent in English, Spanish, and French.',
    },
    {
      id: 2,
      name: 'Hiroshi Tanaka',
      description:
        'Tokyo native and certified tour guide. Passionate about sharing Japanese culture, history, and the best local food experiences.',
    },
    {
      id: 3,
      name: 'James Wilson',
      description:
        "New York local with extensive knowledge of the city's history, art scene, and best kept secrets. 10+ years guiding experience.",
    },
    {
      id: 4,
      name: 'Emma Thompson',
      description:
        'London historian and certified guide. Specializes in royal history, architecture, and traditional British culture experiences.',
    },
    {
      id: 5,
      name: 'Ahmed Al-Rashid',
      description:
        'Dubai local expert offering unique insights into Middle Eastern culture, modern architecture, and luxury experiences.',
    },
  ];

  const data = type === 'destinations' ? (destinations as Destination[]) : (hosts as Host[]);

  return (
    <div className="h-auto md:min-h-screen flex justify-center items-center px-6 md:px-20  py-10 ">
      <div className="w-full max-w-6xl">
        <div className="mb-4 flex justify-center">
          <SectionLabel label={SectionTitle} />
        </div>
        <div className="mb-4 md:mb-20 text-center flex justify-center">
          <h2 className="text-xl font-bricolage leading-[1.05] tracking-tighter   sm:text-2xl w-[70%] md:text-5xl font-semibold text-gray-700 text-center">
            {Description}
          </h2>
        </div>

        {type === 'hosts' ? (
          <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              navigation={{
                nextEl: '.host-swiper-button-next',
                prevEl: '.host-swiper-button-prev',
              }}
              className="w-full pb-20"
            >
              {data.map(item => (
                <SwiperSlide key={item.id}>
                  <div className="flex flex-col items-center">
                    <Card className="rounded-[90px] h-[40vh] w-full relative shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
                      <Image
                        src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
                        alt="Host"
                        fill
                        className="object-cover rounded-[90px] transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <div className="text-white text-center">
                          <p className="text-sm md:text-base leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                    <div className="-mt-[60px] size-30 z-30 rounded-full bg-purple-50 p-6 flex flex-col font-instrument items-center justify-center space-y-2 text-center">
                      <h3 className="text-lg font-normal text-black">{(item as Host).name}</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="host-swiper-button-prev absolute -left-16 top-1/2 z-50 -translate-y-1/2 bg-white rounded-full shadow p-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="host-swiper-button-next absolute -right-16 top-1/2 z-50 -translate-y-1/2 bg-white rounded-full shadow p-2">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Carousel opts={{ align: 'start', loop: true }} className="w-full pb-20">
            <CarouselContent className="-mx-6">
              {data.map(item => (
                <CarouselItem key={item.id} className="px-6 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col items-center">
                    <Card className="rounded-[90px] h-[50vh] w-full relative shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
                      <Image
                        src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1751841644/freddy-rezvanian-Eelegt4hFNc-unsplash_cplvmo.jpg"
                        alt="Destination"
                        fill
                        className="object-cover rounded-[90px] transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <div className="text-white text-center">
                          <p className="text-sm md:text-base leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                    <div className="-mt-[100px] size-40 z-30 rounded-full bg-purple-50 p-6 flex flex-col font-instrument items-center justify-center space-y-2 text-center">
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
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export const SectionJoinerMarquee = () => {
  const marqueeContent = [
    {
      imageurl:
        'https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754611737/travel-luggage_cwevzh.png',
      label: 'Adventure approved',
    },
    {
      imageurl: 'https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754611738/travel_v9i3za.png',
      label: 'Memory enriched',
    },
    {
      imageurl:
        'https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754611738/destination_e5puwk.png',
      label: 'Culture infused',
    },
    {
      imageurl: 'https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754611738/world_wj01uz.png',
      label: 'Stress-free travel',
    },
    {
      imageurl:
        'https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754611796/landscape_t31pnd.png',
      label: 'Wanderlust certified',
    },
  ];

  return (
    <Marquee className="py-6 md:py-10" gradient={false} speed={50}>
      {marqueeContent.map((item, index) => (
        <div key={index} className="flex items-center gap-3 md:gap-6 px-4 md:px-8">
          <div className="relative w-10 h-10 md:w-16 md:h-16 flex-shrink-0">
            <Image
              src={item.imageurl}
              alt={item.label}
              fill
              priority
              className="rounded-full object-cover "
              sizes="(max-width: 768px) 40px, 64px"
            />
          </div>
          <p className="font-bricolage leading-[1.05] tracking-tighter  text-xl md:text-3xl font-semibold text-gray-800 whitespace-nowrap">
            {item.label}
          </p>
        </div>
      ))}
    </Marquee>
  );
};

export const UnreadcountMessageBox = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="relative">
      <MessageCircle size={32} className="text-purple-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[24px]">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};
