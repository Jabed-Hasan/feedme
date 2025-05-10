import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const About = () => {
  return (
    <section className="mx-auto my-10 grid max-w-[1000px] grid-cols-1 gap-10 px-3 md:my-20 lg:grid-cols-5 xl:gap-15">
      <div className="bg-feed-lime relative order-2 col-span-1 block aspect-square rounded-[60px_100%_60px_60px] sm:hidden md:order-1 md:col-span-2 lg:block">
        <Image
          className="absolute top-0 right-0 aspect-square h-11/12 w-11/12 rounded-full border-[15px] border-white"
          src="/home/about/about.jpg"
          alt="about us"
          width={250}
          height={250}
        />
      </div>
      <div className="order-1 col-span-1 flex flex-col items-start justify-center gap-4.5 md:order-2 lg:col-span-3 xl:gap-4">
        <h3 className="text-feed-jungle text-4xl font-medium xl:text-3xl">
          About Us
        </h3>
        <h6 className="text-3xl font-medium xl:text-4xl">
          Food is an Important Part of your Health
        </h6>
        <p className="text-gray-700 md:text-lg">
          At Feedme, we believe that no two appetites are the same. That&apos;s
          why we specialize in handcrafted, fully customizable meals designed to
          match your tastes, lifestyle, and dietary needs. Whether you&apos;re
          fueling a workout, managing allergies, or just craving something
          different, we&apos;ve got you covered.
        </p>
        <Link href="/about">
          <Button className="bg-feed-lime text-feed-jungle border-feed-jungle hover:text-feed-lime hover:bg-feed-jungle h-11 rounded-full border-[1.5px] text-lg font-semibold">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default About;
