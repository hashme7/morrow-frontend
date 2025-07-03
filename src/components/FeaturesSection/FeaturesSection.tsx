import { forwardRef, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card, CardHeader, Image } from "@nextui-org/react";

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
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: feature.animationDelay || 0,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: (feature.animationDelay || 0) + 0.2,
          ease: "power3.out",
        }
      );
    }, [feature.animationDelay]);

    const layoutClass =
      feature.layout === "left"
        ? "lg:flex-row"
        : feature.layout === "right"
        ? "lg:flex-row-reverse"
        : "flex-col";

    return (
      <div
        ref={ref}
        className={`lg:flex ${layoutClass} items-center justify-between w-full min-h-[340px] rounded-3xl backdrop-blur-lg shadow-2xl border border-white/10 transition-all duration-300 hover:scale-[1.025] hover:shadow-white/10 group overflow-hidden`}
      >
        {feature.icon && (
          <div className="flex-1 flex justify-center items-center p-8">
            <Card className="h-[220px] w-[220px] bg-gradient-to-br from-black/80 via-gray-900/80 to-white/10 border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold tracking-widest">
                  {feature.title}
                </p>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover opacity-80"
                src={feature.icon}
                loading="lazy"
              />
            </Card>
          </div>
        )}
        <div className="flex-1 flex flex-col items-start justify-center p-8">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold text-white mb-4 leading-snug drop-shadow-lg"
          >
            {feature.title}
          </h2>
          <p
            ref={descriptionRef}
            className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow"
          >
            {feature.description}
          </p>
        </div>
      </div>
    );
  }
);

export default FeatureSection;
