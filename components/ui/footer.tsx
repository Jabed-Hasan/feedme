import Link from "next/link";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-feed-black text-feed-lime py-8 pt-10">
      <div className="container grid grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="text-3xl font-semibold">
            feedme.
          </Link>
          <p className="w-11/12 text-sm md:text-base">
            Feedme delivers fresh, fully customizable meals made just for
            you—simple, healthy, and tailored to your unique lifestyle.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" aria-label="Facebook" className="text-feed-lime hover:text-white transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-feed-lime hover:text-white transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-feed-lime hover:text-white transition-colors">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Quick Links</h6>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:underline hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/find-meals" className="hover:underline hover:text-white transition-colors">
                Find Meals
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline hover:text-white transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Help & Support</h6>
          <ul className="space-y-3">
            <li>
              <Link href="/contact" className="hover:underline hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/dashboard/customer/my-orders" className="hover:underline hover:text-white transition-colors">
                Order Tracking
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Get In Touch</h6>
          <p className="mb-3 flex items-center text-sm group">
            <FaMapMarkerAlt className="mr-3 text-feed-lime" />
            <span className="group-hover:text-white transition-colors">7462 Oak Ridge Omaha, NE</span>
          </p>
          <p className="mb-3 flex items-center text-sm group">
            <FaPhoneAlt className="mr-3 text-feed-lime" />
            <a href="tel:267-8745-456" className="group-hover:text-white transition-colors">267-8745-456</a>
          </p>
          <p className="flex items-center text-sm group">
            <FaEnvelope className="mr-3 text-feed-lime" />
            <a href="mailto:info@feedme.com" className="group-hover:text-white transition-colors">info@feedme.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800 mx-auto mt-8 pt-6 max-w-6xl px-4 text-center text-sm sm:px-6 lg:px-8">
        Copyright © {new Date().getFullYear()} feedme | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
