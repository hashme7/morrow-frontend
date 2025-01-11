import React from "react";
import Header from "../../components/Home/Header";
import Hero from "../../components/Home/Hero";
import Features from "../../components/FeaturesSection/Features";
import { features } from "../../constants/features";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div
        className="flex flex-col w-full h-full bg-cover bg-no-repeat bg-fixed bg-center"
        style={{ backgroundImage: "url('/assets/images/bg-blacktheme.jpg')" }}
      >
        <Hero />
        <div >
          <Features features={features} />
        </div>
      </div>
    </>
  );
};

export default Home;
