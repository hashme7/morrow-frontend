import React, { useEffect } from "react";
import Header from "../../components/Home/Header";
import Hero from "../../components/Home/Hero";
import Features from "../../components/FeaturesSection/Features";
import { features } from "../../constants/features";
// import { companies } from "../../constants/conpanies";
import { gsap } from "gsap";

const Home: React.FC = () => {
  // const marqueeRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   const marqueeElement = marqueeRef.current;

  //   if (!marqueeElement) return;

  //   // Select all the child elements (company items)
  //   const items = marqueeElement.querySelectorAll(".company-item");

  //   items.forEach((item, index) => {
  //     gsap.fromTo(
  //       item,
  //       { x: "100%" }, // Start position off-screen to the right
  //       {
  //         x: "-100%", // End position off-screen to the left
  //         duration: 10 + index * 2, // Slight variation in duration
  //         ease: "linear",
  //         repeat: -1, // Infinite loop
  //         delay: index * 0.5, // Stagger the start times
  //       }
  //     );
  //   });
  // }, []);

  useEffect(() => {
    gsap.fromTo(
      ".animated-image",
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    );
  }, []);
  return (
    <>
      <Header />
      <div className="flex flex-col w-full h-full bg-cover bg-no-repeat bg-fixed bg-center">
        <Hero />
        <img
          className="animated-image"
          src="/assets/images/project-mangement.webp"
          alt=""
        />
        <div>
          <Features features={features} />
        </div>
        {/* <div className="relative py-8 overflow-hidden">
          <h2 className="text-center text-white text-2xl md:text-3xl font-semibold mb-6 tracking-wide  p-3 border-b-3">
            Trusted by Top Project Management Tools
          </h2>
          <div
            ref={marqueeRef}
            className="flex justify-center items-center space-x-8 overflow-hidden"
          >
            {companies.map((company, index) => (
              <div
                key={index}
                className="company-item flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain"
                />
                <span className="text-gray-300 text-sm md:text-base whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
