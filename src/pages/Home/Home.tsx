import React, { Suspense, useEffect, useRef } from "react";
const Header = React.lazy(() => import("../../components/Home/Header"));
const Hero = React.lazy(() => import("../../components/Home/Hero"));
const Features = React.lazy(
  () => import("../../components/FeaturesSection/Features")
);

import { features } from "../../constants/features";

const Home: React.FC = () => {
  const animatedImg = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const animation = gsap.fromTo(
        ".animated-image",
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
      );

      return () => animation.kill();
    });
  }, []);
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <Header />
      <Hero />
      <img
        ref={animatedImg}
        className="animated-image"
        src="/assets/images/project-mangement.webp"
        loading="lazy"
        alt="Project Management"
      />
      <Features features={features} />
    </Suspense>
  );
};

export default Home;
