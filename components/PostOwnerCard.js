// components/PostOwnerCard.js
import React from 'react';
import Image from 'next/image';

const PostOwnerCard = ({ author }) => {
  return (
    <div className=" mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="flex-shrink-0">
      <svg
    width="50"
    height="50"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#E0E0E0" />
    <path
      d="M12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14Z"
      fill="#BDBDBD"
    />
    <path
      d="M4 20C4 17.2386 8.68629 16 12 16C15.3137 16 20 17.2386 20 20V22H4V20Z"
      fill="#BDBDBD"
    />
  </svg>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-bold">{author}</h3>
      </div>
    </div>
  );
};

export default PostOwnerCard;
