/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import logo from "../public/yt icon.png"
const Footer = () => {
  const [t, i18n] = useTranslation('footer');
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    // Fetch blog data from your API
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/api/blogs'); // Update this URL to your actual API endpoint
        const blogs = response.data;
        const data = blogs.map(blog => {
          const translation = blog.translations[i18n.language] || {};
          return {
            title: translation.title || blog.title || blog.Title,
            slug: translation.slug || blog.slug
          };
        });
        setBlogData(data);
      } catch (error) {
        console.error('Error fetching blog data:', error.message);
      }
    };

    fetchBlogData();
  }, [i18n.language]);

  // Function to get random titles and slugs
  const getRandomData = (data, num) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  // Get random blog data to display
  const randomData = getRandomData(blogData, 5);

  return (
    <div>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          
            {/* Solutions Column */}
            <div>
            <Image src={logo} alt="logo" width={128} height={64}/>
              <p className="mt-5 text-gray-400">
                {t('Welcome to Microters, your creative marketing partner. We turn vision into measurable success with innovative strategies and data-driven solutions.')}
              </p>
              <div className="flex mt-4 space-x-2">
                <FaFacebook className="fs-3 hover:text-blue-800 transition duration-300 transform hover:scale-110" />
                <FaInstagram className="fs-3 ms-2 hover:text-pink-800 transition duration-300 transform hover:scale-110" />
                <FaTwitter className="fs-3 ms-2 hover:text-blue-600 transition duration-300 transform hover:scale-110" />
                <FaLinkedin className="fs-3 ms-2 hover:text-blue-900 transition duration-300 transform hover:scale-110" />
              </div>
            </div>
            {/* Support Column */}
            <div>
              <h5 className="text-sm font-semibold uppercase text-white">
                {t('Help & Support')}
              </h5>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-white">
                    {t('Pricing')}
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-gray-300 hover:text-white">
                    {'Refund Policy'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    {t('Contact Us')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white">
                    {t('Terms of Service')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white">
                    {t('Privacy Policy')}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white">
                    {t('Blog')}
                  </Link>
                </li>
              </ul>
            </div>
            {/* Tools Column */}
            <div>
              <h5 className="text-sm font-semibold uppercase text-white">Recent News</h5>
              <ul className="mt-4 space-y-2">
                {randomData.map((blog, index) => (
                  <li key={index}>
                    <Link href={`/blog/${blog.slug}`} className="text-gray-300 hover:text-white">
                      {blog.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Column */}
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
              <h5 className="text-sm font-semibold uppercase text-white">
                {t('Contact')}
              </h5>
              <h6 className="mt-2 text-white-400 fw-bold text-white">
                USA: <span className="text-gray-400 ">{t('30 N Gould St Ste R Sheridan WY 82801, United States')}</span>
              </h6>
              <p className="mt-2 text-gray-400">
                {t('The latest news, articles, and resources, sent to your inbox weekly.')}
              </p>
              <form action="#" method="POST" className="mt-4">
                <div className="flex flex-col mt-1 space-y-2">
                  <input
                    type="email"
                    name="email"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-3 pt-3 pb-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t('Subscribe')}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <p className="text-base text-gray-400 xl:text-center">
              {t('© 2024 Microters, Inc. All rights reserved.')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
