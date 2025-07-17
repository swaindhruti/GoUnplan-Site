"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const BackButton = ({
  isWhite,
  route
}: {
  isWhite: boolean;
  route: string;
}) => {
  return (
    <>
      <Link
        href={route}
        className={`inline-flex items-center gap-2 ${
          isWhite
            ? "text-white hover:text-white/90"
            : "text-black hover:text-black/90"
        } transition-colors text-lg duration-300 px-4 py-2 fixed top-4 left-4 z-50`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-normal font-roboto">Back </span>
      </Link>
    </>
  );
};
