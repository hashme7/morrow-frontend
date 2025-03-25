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
        { opacity: 1, y: 0, duration: 0.4, delay: feature.animationDelay || 0 }
      );
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
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
        className={`flex ${layoutClass} items-center justify-between w-full min-h-[400px]`} // Ensuring a minimum height
        style={{
          backgroundColor: "transparent",
        }}
      >
        {feature.icon && (
          <div className="flex-1 flex justify-center items-center">
            <Card
              className="col-span-12 sm:col-span-4 h-[300px] shadow-lg shadow-current"
            >
              <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {feature.title}
                </p>
                <h4 className="text-white font-medium text-large">
                  Creates beauty like a beast
                </h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src="https://nextui.org/images/card-example-2.jpeg"
              />
            </Card>
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
            className="text-lg lg:text-xl text-white leading-relaxed"
          >
            {feature.description}
          </p>
        </div>
      </div>
    );
  }
);

export default FeatureSection;