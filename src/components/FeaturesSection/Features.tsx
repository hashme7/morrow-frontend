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
          y: 100, 
        };

        if (animation === "slide-down") {
          animationConfig = { opacity: 0, y: -50 };
        } else if (animation === "fade-in") {
          animationConfig = { opacity: 0, y: 0 };
        }
        gsap.fromTo(section, animationConfig, {
          opacity: 1,
          y: 0,
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%", 
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
    <div className="flex flex-col h-full w-full bg-fixed bg-cover px-4 lg:px-8 lg:mt-24 lg:mb-24 ">
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-200">
          Discover the features that make Morrow so easy to use
        </h1>
        <p className="mt-4 text-gray-400 text-lg lg:text-xl">
          Explore our innovative features designed to boost your productivity.
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:gap-16">
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
    </div>
  );
};

export default Features;
