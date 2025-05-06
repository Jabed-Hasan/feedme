import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <section className="py-5 max-h-[75vh] overflow-hidden">
      {/* Text */}
      <div className="container flex flex-col items-center text-center">
        <h2 className="text-3xl font-medium sm:text-4xl md:text-5xl md:leading-[60px] lg:text-6xl lg:leading-[70px]">
          Fresh and healthy
          <br />
          food for your{" "}
          <span className="relative inline-block">
            <span className="relative z-10">table</span>
            <span
              className="absolute -inset-2 top-0 z-0 -rotate-4 transform rounded-[28px] bg-lime-400/40"
              style={{
                filter: "blur(1px)",
                boxShadow: "0 0 6px rgba(163, 230, 53, 0.3)",
              }}
            />
          </span>
        </h2>

        <p className="my-3 text-sm text-gray-700 md:my-3.5 md:text-base lg:text-lg">
          Order healthy and delicious dishes at any time,
          <br className="" />
          and we&apos;ll make sure it is safely delivered to your home
        </p>

        <div className="flex items-center gap-4 mb-3.5">
          <Button className="border-feed-jungle text-feed hover:bg-feed-jungle bg-feed-lime h-10 rounded-full border-2 text-base font-medium transition-colors hover:text-lime-400">
            Order now
          </Button>
          <Link
            className="hover:text-feed-jungle border-feed-jungle text-base font-medium text-gray-800 duration-100 ease-in-out hover:border-b-2"
            href="/"
          >
            See the menu
          </Link>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative container mt-3 flex items-center overflow-hidden lg:mt-5">
        <div className="absolute left-0 z-10 h-full w-10 bg-linear-to-r from-white to-transparent sm:w-20" />
        <div className="marquee flex w-max items-center gap-5 overflow-visible">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, idx) => (
            <Image
              key={idx}
              src={`/home/banner/banner${i % 5 || 5}.png`}
              alt={`banner${i}`}
              className="w-[120px] object-cover md:w-[160px]"
              width={160}
              height={160}
            />
          ))}
        </div>
        <div className="absolute right-0 z-10 h-full w-10 bg-linear-to-r from-transparent to-white sm:w-20" />
      </div>
    </section>
  );
};

export default Header;
