import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

type ScrollOptions = {
  location: string | number;
  duration?: number;
  ease?: string;
};

export const handleScroll = ({
  location,
  duration = 1.5,
  ease = "power3.inOut"
}: ScrollOptions): void => {
  if (typeof location !== "string" && typeof location !== "number") {
    console.error("Invalid scroll location. Must be a string or number.");
    return;
  }

  gsap.to(window, {
    duration,
    scrollTo: location,
    ease
  });
};
