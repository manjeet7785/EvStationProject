import React, { useState, useRef } from 'react';
import { FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center mb-3">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <FaStar
            key={index}
            className="text-xl"
            color={ratingValue <= rating ? "#f59e0b" : "#e4e5e9"}
          />
        );
      })}
    </div>
  );
};

const Testimonials = () => {
  const [filterMode, setFilterMode] = useState('All');
  const scrollContainerRef = useRef(null);

  const testimonialsData = [
    { id: 1, name: "Priya Sharma", designation: "Daily Commuter", quote: "Main roz subah office ke liye jaldi mein hoti hoon. Aapke Fast DC Chargers ne meri life aasaan kar di hai. Top-notch reliability aur hamesha available!", icon: "🚗", rating: 5 },
    { id: 2, name: "Manish Gupta", designation: "New EV Owner", quote: "Manjeet EV Hub ki app bahut simple hai—station dhundhna, payment karna, sab kuch ek tap mein ho jata hai. Charging ka darr khatam!", icon: "👍", rating: 4 },
    { id: 3, name: "Rajesh Varma", designation: "Logistics Fleet Manager", quote: "Enterprise solution shandaar hai. Hum real-time mein performance monitor kar paate hain aur costs bahut optimize ho gaye hain. Best fleet partner.", icon: "🚛", rating: 5 },
    { id: 4, name: "Aisha Khan", designation: "Delivery Partner", quote: "Battery Swapping ne mera kaam revolutionise kar diya hai. Sirf 2 minute mein full charge! Petrol se bhi zyada tez aur earning badh gayi hai.", icon: "🛵", rating: 5 },
    { id: 5, name: "Gaurav Bansal", designation: "Tech Enthusiast", quote: "The seamless swap technology is impressive. The stations are clean and the process is completely automated. This is truly the future of EV refueling.", icon: "💡", rating: 4 },
    { id: 6, name: "Deepa Iyer", designation: "Long Distance Driver", quote: "Long highway trips par swap functionality ek **brilliant backup** hai. Instant power boost ki option se range anxiety zero ho gayi hai. Very reassuring.", icon: "🛣️", rating: 5 },
    { id: 7, name: "Vikram Mehta", designation: "Gig Worker", quote: "Meri earning is par nirbhar hai. Inki service itni consistent aur tez hai ki mujhe kabhi downtime nahi mila. Reliable service for quick charge-ups.", icon: "🔋", rating: 4 },
    { id: 8, name: "Neha Sharma", designation: "Software Engineer", quote: "DC charging aur swapping dono ka option milna customer ko **flexibility** deta hai. Rush hour mein swap best hai, raat mein plug-in! Great choice.", icon: "🔄", rating: 5 },
    { id: 9, name: "Sunil Kumar", designation: "Local Businessman", quote: "Level 2 AC charging stations office ke paas perfect hain. Jab tak meri meetings chalti hain, gaadi charge ho jaati hai. Bilkul convenient solution.", icon: "🏢", rating: 4 },
    { id: 10, name: "Zahra Ali", designation: "Travel Vlogger", quote: "Meri cross-city trip par swap station was a lifesaver. Sirf ek minute aur main fully powered! Fast, innovative, aur time-saving. Must use service!", icon: "⚡", rating: 5 },
  ];

  const filteredTestimonials = testimonialsData.filter(testimonial => {
    if (filterMode === 'All') return true;
    const swappingKeywords = ["swap", "swapping", "battery", "minute", "revolutionise"];
    const quoteLower = testimonial.quote.toLowerCase();
    return swappingKeywords.some(keyword => quoteLower.includes(keyword));
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full py-16 mt-20 bg-gray-50 dark:bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Trusted by EV Owners & Businesses
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setFilterMode('All')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${filterMode === 'All' ? 'bg-amber-600 text-white shadow-md scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-amber-100'}`}
          >
            All Testimonials
          </button>
          <button
            onClick={() => setFilterMode('Swapping')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${filterMode === 'Swapping' ? 'bg-amber-600 text-white shadow-md scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-amber-100'}`}
          >
            Battery Swapping Reviews 🔋
          </button>
        </div>

        <div className="relative mt-12 group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-full shadow-2xl z-20 hover:bg-amber-600 hover:text-white transition duration-300 hidden md:block border border-gray-100 dark:border-gray-700"
            aria-label="Scroll left"
          >
            <FaArrowLeft />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex flex-nowrap gap-8 overflow-x-auto px-4 py-6 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] lg:w-[450px] snap-center 
                           bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg 
                           border-t-4 border-amber-500 flex flex-col items-center text-center transform transition duration-300 hover:shadow-2xl"
              >
                <span className="text-5xl mb-4" role="img" aria-label="user-icon">
                  {testimonial.icon}
                </span>

                <StarRating rating={testimonial.rating} />

                <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed flex-grow">
                  "{testimonial.quote}"
                </p>

                <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-full shadow-2xl z-20 hover:bg-amber-600 hover:text-white transition duration-300 hidden md:block border border-gray-100 dark:border-gray-700"
            aria-label="Scroll right"
          >
            <FaArrowRight />
          </button>

          {filteredTestimonials.length === 0 && (
            <div className="mt-10 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-inner">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Nahi mila! Please try "All Testimonials" for more reviews.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Testimonials;