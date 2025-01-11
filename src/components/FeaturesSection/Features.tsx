import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeatureSection from "./FeaturesSection";

interface Feature {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  animation?: string;
  color?: string;
  isFeatured?: boolean;
  backgroundImage?: string;
}

interface FeaturesProps {
  features: Feature[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    sectionsRef.current.forEach((section, index) => {
      const feature = features[index];
      const animation = feature.animation;

      if (section) {
        let animationConfig: gsap.TweenVars = {
          opacity: 0,
          y: 200,
        };

        if (animation === "slide-down") {
          animationConfig = { y: -100 };
        } else if (animation === "fade-in") {
          animationConfig = { opacity: 0 };
        }

        gsap.fromTo(section, animationConfig, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reset",
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [features]);

  return (
    <div
      className="flex flex-col h-full w-full bg-fit bg-fixed bg-cover"
      style={{ backgroundImage: "url('/assets/images/bg-features.webp')" }}
    >
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold justify-center text-gray-200">
          Discover the features that make Morrow so easy to use
        </h1>
      </div>
      {features.map((feature, index) => (
        <FeatureSection
          key={feature.id}
          feature={feature}
          ref={(el: HTMLDivElement) =>
            (sectionsRef.current[index] = el as HTMLDivElement)
          }
        />
      ))}
    </div>
  );
};

export default Features;
