import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register the ScrollTo plugin
gsap.registerPlugin(ScrollToPlugin);

// Smooth scroll to section function
export const smoothScrollToSection = (
  targetElement: string | HTMLElement,
  options: {
    duration?: number;
    ease?: string;
    offset?: number;
    onComplete?: (() => void) | null;
    onStart?: (() => void) | null;
  } = {}
) => {
  const defaults = {
    duration: 1.5,
    ease: "power2.inOut",
    offset: 0,
    onComplete: null,
    onStart: null
  };

  const config = { ...defaults, ...options };

  const target =
    typeof targetElement === "string"
      ? document.querySelector(targetElement)
      : targetElement;

  if (!target) {
    console.warn("Target element not found");
    return;
  }
  // Use getBoundingClientRect for more robust offset calculation
  const scrollY = window.scrollY || window.pageYOffset;
  const targetPosition =
    (target as HTMLElement).getBoundingClientRect().top +
    scrollY +
    (config.offset ?? 0);

  gsap.to(window, {
    duration: config.duration,
    scrollTo: {
      y: targetPosition,
      autoKill: true,
      onAutoKill: () =>
        console.log("Scroll animation killed by user interaction")
    },
    ease: config.ease,
    onStart: config.onStart ?? undefined,
    onComplete: config.onComplete ?? undefined
  });
};
