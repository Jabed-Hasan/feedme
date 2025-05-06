import Image from "next/image";

const ServingCustomer = () => {
  return (
    <div className="container py-5 md:px-0 md:py-10">
      <div className="grid grid-cols-5 gap-5 rounded-4xl border-[3px] p-3 md:gap-10 md:p-10 lg:p-20">
        <div className="col-span-5 flex flex-col items-center gap-10 md:col-span-2">
          <h3 className="text-feed-black border-feed-jungle inline-block border-b-4 px-4 py-3 text-lg font-medium md:text-base lg:text-2xl">
            Serving Customer
          </h3>
          <div>
            <Image
              className="w-full rounded-2xl"
              src="/home/servingCustomer/serving-customer-1.jpg"
              alt="serving-customer-bg"
              height={400}
              width={400}
            />
          </div>
        </div>
        <div className="col-span-5 flex flex-col items-center gap-5 md:col-span-3 lg:gap-10">
          <div className="order-2 md:order-1">
            <Image
              className="w-full rounded-2xl"
              src="/home/servingCustomer/serving-customer-2.jpg"
              alt="serving-customer-bg"
              height={400}
              width={700}
            />
          </div>
          <div className="order-1 space-y-2 md:order-2 lg:space-y-5">
            <h3 className="text-2xl font-medium">Over The Years</h3>
            <div className="flex gap-10 lg:gap-20">
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  30+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  BREAKFAST
                  <br />
                  OPTIONS
                </p>
              </div>
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  50+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  DINNER
                  <br />
                  OPTIONS
                </p>
              </div>
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  8+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  NEW
                  <br />
                  LOCATION
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600">
              Our menu features a variety of dishes all made with seasonal
              ingredients
            </p>
          </div>
        </div>
      </div>
      
      {/* Redesigned Stats Section */}
      <div className="mt-16 mb-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-feed-jungle mb-3">Our Journey in Numbers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            For over two decades, we&apos;ve grown from a small family business to a leading healthy food provider, 
            serving thousands of satisfied customers across multiple locations.
          </p>
          <div className="h-1 w-20 bg-feed-lime mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="bg-feed-jungle/10 rounded-3xl py-10 px-4 md:px-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-feed-lime/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-feed-lime/20 rounded-full blur-xl"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            <div className="flex flex-col items-center text-center bg-white rounded-2xl p-5 shadow-md transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-feed-jungle text-2xl md:text-5xl font-bold mb-2">
                26
              </h3>
              <div className="h-1 w-10 bg-feed-lime mb-3 rounded-full"></div>
              <p className="font-medium text-gray-700 text-sm md:text-base uppercase tracking-wide">
                YEAR EXPERIENCE
              </p>
              <p className="text-gray-600 text-xs mt-2">Serving quality since 1998</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white rounded-2xl p-5 shadow-md transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-feed-jungle text-2xl md:text-5xl font-bold mb-2">
                100
              </h3>
              <div className="h-1 w-10 bg-feed-lime mb-3 rounded-full"></div>
              <p className="font-medium text-gray-700 text-sm md:text-base uppercase tracking-wide">
                MENU/DISH
              </p>
              <p className="text-gray-600 text-xs mt-2">Fresh recipes updated seasonally</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white rounded-2xl p-5 shadow-md transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-feed-jungle text-2xl md:text-5xl font-bold mb-2">
                50
              </h3>
              <div className="h-1 w-10 bg-feed-lime mb-3 rounded-full"></div>
              <p className="font-medium text-gray-700 text-sm md:text-base uppercase tracking-wide">
                STAFFS
              </p>
              <p className="text-gray-600 text-xs mt-2">Dedicated professionals</p>
            </div>
            
            <div className="flex flex-col items-center text-center bg-white rounded-2xl p-5 shadow-md transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-feed-jungle text-2xl md:text-5xl font-bold mb-2">
                15,000
              </h3>
              <div className="h-1 w-10 bg-feed-lime mb-3 rounded-full"></div>
              <p className="font-medium text-gray-700 text-sm md:text-base uppercase tracking-wide">
                HAPPY CUSTOMER
              </p>
              <p className="text-gray-600 text-xs mt-2">And counting every day</p>
            </div>
          </div>
          
          <div className="text-center mt-8 md:mt-10">
            <p className="text-feed-jungle font-medium italic">
              &quot;Our commitment to quality and customer satisfaction is the foundation of our success.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServingCustomer;
