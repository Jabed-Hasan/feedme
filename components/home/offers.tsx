"use client";

import Link from "next/link";
import { Clock, Tag, TrendingUp } from "lucide-react";

const Offers = () => {
  const offerItems = [
    {
      id: 1,
      title: "30% Off First Order",
      description: "Get 30% off on your first order when you sign up for our meal delivery service",
      code: "NEWFEEDME30",
      validUntil: "June 30, 2024",
      badge: "New Customer",
      icon: <Tag className="w-10 h-10 text-feed-jungle" />,
    },
    {
      id: 2,
      title: "Weekly Meal Plan Bundle",
      description: "Save 15% when you subscribe to our weekly meal plan with 5 or more meals",
      code: "WEEKLY15",
      validUntil: "Ongoing",
      badge: "Popular",
      icon: <Clock className="w-10 h-10 text-feed-jungle" />,
    },
    {
      id: 3,
      title: "Refer a Friend",
      description: "Get $20 credit when you refer a friend and they make their first purchase",
      code: "REFER20",
      validUntil: "Ongoing",
      badge: "Referral",
      icon: <TrendingUp className="w-10 h-10 text-feed-jungle" />,
    },
  ];

  return (
    <section className="py-16 bg-feed-lime/20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-feed-black">
            Special Offers & Promotions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of our exclusive deals and save on your favorite meals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerItems.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-feed-lime/30"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  {offer.icon}
                  <span className="bg-feed-jungle text-feed-lime text-xs font-semibold px-3 py-1 rounded-full">
                    {offer.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-feed-jungle mb-3">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-500 text-sm mb-1">Promo Code:</p>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-lg font-semibold text-feed-jungle">
                      {offer.code}
                    </span>
                    <button 
                      className="text-xs text-feed-jungle font-medium underline"
                      onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                      }}
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Valid until: {offer.validUntil}
                  </span>
                  <Link
                    href="/find-meals"
                    className="text-feed-lime bg-feed-jungle py-1.5 px-5 rounded-full text-sm font-medium hover:bg-feed-jungle/80 transition-colors"
                  >
                    Use Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            href="/find-meals" 
            className="inline-block bg-feed-jungle text-feed-lime px-8 py-2.5 rounded-full font-medium text-lg hover:bg-feed-jungle/80 transition-colors"
          >
            Browse All Meals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Offers; 