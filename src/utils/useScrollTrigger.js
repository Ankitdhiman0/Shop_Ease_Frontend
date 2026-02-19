import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollTrigger = () => {
  const ctx = useRef(gsap.context(() => {}));

  useEffect(() => {
    ctx.current.add(() => {
      // Kill existing triggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    });

    // Smooth scroll animations
    gsap.utils.toArray(".fade-in-up").forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Horizontal scroll
    gsap.utils.toArray(".horizontal-scroll").forEach((section) => {
      const items = section.querySelectorAll(".scroll-item");

      gsap.to(items, {
        xPercent: -100 * (items.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + section.offsetWidth,
          invalidateOnRefresh: true,
        },
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => ctx.current.revert();
  }, []);

  return null;
};
