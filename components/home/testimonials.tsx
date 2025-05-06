"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Jessica Miller",
      position: "Marketing Executive",
      avatar: "/images/placeholder.jpg",
      rating: 5,
      comment: "Feedme has completely transformed my lunch breaks at work. The meals are always fresh, delicious, and perfectly portioned. I've been able to maintain a healthy diet without sacrificing taste or time.",
    },
    {
      id: 2,
      name: "David Chen",
      position: "Software Engineer",
      avatar: "/images/placeholder.jpg",
      rating: 5,
      comment: "As someone with specific dietary needs, finding convenient meal options has always been challenging. Feedme's customization options and attention to dietary restrictions have made my life so much easier.",
    },
    {
      id: 3,
      name: "Emma Thompson",
      position: "Fitness Trainer",
      avatar: "/images/placeholder.jpg",
      rating: 5,
      comment: "I recommend Feedme to all my clients who are serious about their nutrition. The macro information on each meal makes it easy to track progress, and the food actually tastes amazing.",
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      position: "Healthcare Professional",
      avatar: "/images/placeholder.jpg",
      rating: 4,
      comment: "Working long shifts made it difficult to eat properly, but Feedme has solved that problem. Their meal delivery is reliable, and the food stays fresh in my locker until my break time.",
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <section className="py-16 bg-feed-jungle">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-feed-lime">
            What Our Customers Say
          </h2>
          <p className="text-feed-lime/70 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers who have transformed their eating habits with Feedme
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex flex-col items-center md:items-start">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 overflow-hidden"></div>
                <h4 className="text-xl font-bold text-feed-jungle">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-500 mb-3">
                  {testimonials[currentIndex].position}
                </p>
                <div className="flex space-x-1 mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>
              
              <div className="flex-1">
                <blockquote className="text-gray-700 text-lg italic relative">
                  <span className="text-5xl text-feed-jungle/20 absolute -top-6 -left-2">"</span>
                  {testimonials[currentIndex].comment}
                  <span className="text-5xl text-feed-jungle/20 absolute -bottom-10 right-0">"</span>
                </blockquote>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="bg-feed-lime text-feed-jungle rounded-full p-2 hover:bg-feed-lime/80 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-feed-lime" : "bg-feed-lime/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="bg-feed-lime text-feed-jungle rounded-full p-2 hover:bg-feed-lime/80 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 