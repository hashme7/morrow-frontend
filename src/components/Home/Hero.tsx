import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subTitleRef = useRef<HTMLHeadingElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const radius = 150;
    const duration = 10;
    const centerX = 0;
    const centerY = 0;

    imageRefs.current.forEach((image, index) => {
      if (image) {
        gsap.to(image, {
          duration,
          repeat: -1,
          ease: "none",
          motionPath: {
            path: [
              {
                x: centerX + radius * Math.cos((index * 2 * Math.PI) / 3),
                y: centerY + radius * Math.sin((index * 2 * Math.PI) / 3),
              },
              {
                x: centerX + radius * Math.cos(((index + 1) * 2 * Math.PI) / 3),
                y: centerY + radius * Math.sin(((index + 1) * 2 * Math.PI) / 3),
              },
            ],
            alignOrigin: [0.5, 0.5],
          },
        });
      }
    });
  }, []);

  return (
    <section className="flex flex-col justify-center items-center text-center  lg:px-8 text-white h-fit relative">
      <div className="text-center pt-52">
        <h1
          ref={titleRef}
          className="text-5xl lg:text-7xl text-gray-100 mb-4 dm-serif-text-regular"
        >
          Manage Your Projects With <br />
          <div className="flex items-center justify-center">
            <span className="text-zinc-400 lg:text-5xl">Morrow</span>
          </div>
        </h1>

        <p ref={subTitleRef} className="text-lg text-gray-400 font-light mb-6">
          Seamless collaboration and real-time insights to bring your projects
          to life.
        </p>

        <Link to="/login">
          <Button
            radius="full"
            className="bg-gray-900 text-gray-200 hover:bg-gray-700 px-8 py-3 shadow-lg"
          >
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
