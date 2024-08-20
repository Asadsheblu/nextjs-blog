import Link from 'next/link';
import React from 'react';

const AuthorCard = ({ name, role, image }) => {
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  
  const slug = generateSlug(name);
  const authorLink = `/author/${slug}?role=${role.toLowerCase()}`;

  return (
    <div className="flex flex-col md:flex-row space-y-1 items-center md:space-y-0 md:space-x-2 ps-4 pe-4 border-r border-gray-200 last:border-r-0">
      {image && (
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
      )}
      <div className="md:text-left sm:text-center pt-4 ps-4">
        <small className="font-bold mb-1">
          {role === 'Author' ? 'Written by' : role === 'Editor' ? 'Edited by' : 'Developed by'}
        </small>
        <p className="text-base font-semibold mb-1">
          <Link href={authorLink} className="text-black">
            {name}
          </Link>
        </p>
        <p className="text-gray-600 text-base">{role}</p>
      </div>
    </div>
  );
};

const AuthorInfo = ({ data }) => {
  if (!data) return null;


  return (
    <div className="mt-5 mb-5 flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 bg-white rounded-lg ps-5 pe-5 pt-2 pb-2 grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.author && (
        <AuthorCard
          name={data.author.name}
          role="Author"
          image={data.author.image}
        />
      )}
      {data.editor && (
        <AuthorCard
          name={data.editor.name}
          role="Editor"
          image={data.editor.image}
        />
      )}
      {data.developer && (
        <AuthorCard
          name={data.developer.name}
          role="Developer"
          image={data.developer.image}
        />
      )}
    </div>
  );
};

export default AuthorInfo;
