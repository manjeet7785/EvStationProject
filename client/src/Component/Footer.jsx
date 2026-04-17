import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Careers", href: "#careers" },
    { name: "Press & Media", href: "#media" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
  ];

  const services = [
    { name: "Fast DC Charging", href: "#dc-charge" },
    { name: "AC Level 2 Charging", href: "#ac-charge" },
    { name: "Battery Swapping", href: "#swap" },
    { name: "Fleet Management", href: "#fleet" },
    { name: "Home Solutions", href: "#home" },
  ];

  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">


          <div className="col-span-2 md:col-span-2 flex flex-col items-start">
            <h3 className="text-3xl font-bold text-amber-500">
              Manjeet <span className="text-white">EV Hub</span>
            </h3>
            <p className="mt-4 text-gray-400 text-sm max-w-sm">
              Powering the future of sustainable transport with intelligent charging and swapping solutions.
            </p>


            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-amber-500 transition text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-gray-400 hover:text-amber-500 transition text-sm">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <h4 className="text-lg font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <FaMapMarkerAlt className="flex-shrink-0 mt-1 text-amber-500" />
                <span>MPPP EV Tech Park,BBD Green City, India</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaPhone className="flex-shrink-0 text-amber-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaEnvelope className="flex-shrink-0 text-amber-500" />
                <span>manjeetmaurya7785@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>


      <div className="bg-gray-900 py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Manjeet EV Hub. All rights reserved. | Built with 💖 for a Greener Future.
        </div>
      </div>
    </footer>
  );
}

export default Footer;