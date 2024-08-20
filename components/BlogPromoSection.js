import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import team from "../public/team.webp"
import sb from "../public/sb.webp"
const PromoSection = () => {
  return (
    <div className="promo-section bg-gray-100 flex p-5">
      <div className="container max-w-7xl   flex flex-col md:flex-row items-center justify-between">
        <div className="promo-text max-w-lg pt-20 pb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Unlock Your Online Earning Potential</h2>
          <p className="text-gray-600 mb-6">Tap into the latest opportunities to monetize your skills and passions.</p>
          <button  className='btn btn-danger rounded-lg pt-3 pb-3 ps-5 pe-5'>
          <Link className='text-white' href="/blog">
           Read Our Blog
          </Link>
          </button>
          
        </div>
        <div className="promo-images relative mt-20 md:mt-0 flex justify-end">
          <div className="relative  w-[305px] h-[250px] mr-4">
            <Image src={team} alt="Image 1" layout="fill" className="rounded-lg shadow-lg" />
            <div className="absolute -bottom-3 -left-3 md:w-16 md:h-16 bg-red-500 w-12 h-12 rounded-lg red-test"></div>
          </div>
          <div className="relative  w-[305px] h-[250px] test">
            <Image src={sb} alt="Image 2" layout="fill" className="rounded-lg shadow-lg" />
            <div className="absolute -top-3 -right-3 md:w-24 md:h-24 w-16 h-16 bg-white white-test  rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoSection;
