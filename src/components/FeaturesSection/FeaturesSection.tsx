import { forwardRef, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface Feature {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  layout?: "left" | "right" | "center";
  animationDelay?: number;
}

interface FeatureSectionProps {
  feature: Feature;
}

const FeatureSection = forwardRef<HTMLDivElement, FeatureSectionProps>(
  ({ feature }, ref) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: feature.animationDelay || 0 }
      );
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: feature.animationDelay || 0.2,
        }
      );
    }, [feature.animationDelay]);

    const layoutClass =
      feature.layout === "left"
        ? "flex-row"
        : feature.layout === "right"
        ? "flex-row-reverse"
        : "flex-col";

    return (
      <div
        ref={ref}
        className={`flex ${layoutClass} items-center justify-between h-screen w-full px-5 `}
        style={{
          backgroundColor: "transparent",
        }}
      >
        {feature.icon && (
          <div className="flex-1 flex justify-center items-center">
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-96 h-auto object-contain rounded-3xl"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col items-start justify-center p-5">
          <h2
            ref={titleRef}
            className="text-4xl font-bold text-white mb-4 leading-snug"
          >
            {feature.title}
          </h2>
          <p
            ref={descriptionRef}
            className="text-lg lg:text-2xl text-gray-400 leading-relaxed"
          >
            {feature.description}
          </p>
        </div>
      </div>
    );
  }
);

export default FeatureSection;
