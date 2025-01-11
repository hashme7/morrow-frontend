import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register the plugin (if not already registered)
gsap.registerPlugin(MotionPathPlugin);

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subTitleRef = useRef<HTMLHeadingElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]); // Correctly type as an array

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -300, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 2,
        ease: "Power3.easeOut",
        onComplete: () => {
          gsap.set(titleRef.current, { clearProps: "all" });
        },
      }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      subTitleRef.current,
      { x: -300, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 2,
        delay: 1,
        ease: "Power3.easeOut",
        onComplete: () => {
          gsap.set(titleRef.current, { clearProps: "all" });
        },
      }
    );
  }, []);

  useEffect(() => {
    const radius = 150; // Radius for the circular motion
    const duration = 10; // Time for one complete rotation
    const centerX = 0; // Center X coordinate (relative to the div)
    const centerY = 0; // Center Y coordinate (relative to the div)

    // Apply circular motion for each image
    imageRefs.current.forEach((image, index) => {
      if (image) {
        gsap.to(image, {
          duration,
          repeat: -1,
          ease: "none",
          motionPath: {
            path: [
              { x: centerX + radius * Math.cos((index * 2 * Math.PI) / 3), y: centerY + radius * Math.sin((index * 2 * Math.PI) / 3) },
              { x: centerX + radius * Math.cos(((index + 1) * 2 * Math.PI) / 3), y: centerY + radius * Math.sin(((index + 1) * 2 * Math.PI) / 3) }
            ],
            alignOrigin: [0.5, 0.5],
          },
        });
      }
    });
  }, []);

  return (
    <section className="hero h-screen flex flex-col lg:flex-row justify-center items-center text-center lg:text-left px-4 lg:px-8 text-white min-h-screen relative">
      <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
        <h1 ref={titleRef} className="font-inter text-5xl lg:text-5xl text-gray-100 mb-4 font-bold">
          Manage Your Projects With <span className="text-black lg:text-5xl">Morrow</span>
        </h1>
        <p ref={subTitleRef} className="text-lg lg:text-2xl text-gray-400 font-light mb-6">
          Seamless collaboration and real-time insights to bring your projects to life.
        </p>
        <Link to='/login'>
          <Button
            radius="full"
            className="bg-gray-900 text-gray-200 hover:bg-gray-700 px-8 py-3 shadow-lg"
          >
            Get Started for Free
          </Button>
        </Link>
      </div>
      <div className="lg:w-1/2 lg:relative lg:pl-40">
        <div className="flex-grow relative" style={{ width: 300, height: 300 }}> 
          {["project-management.jpg", "image2.jpg", "image3.jpg"].map((src, index) => (
            <div
              key={index}
              ref={(el) => (imageRefs.current[index] = el)} 
              className="absolute rounded-2xl shadow-lg"
              style={{ width: 100, height: 100 }} 
            >
              <img
                width={100}
                height={100}
                src={`assets/images/${src}`}
                alt={`project-management-${index}`}
                className="rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
