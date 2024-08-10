import Link from 'next/link';

const Breadcrumb = ({ categorySlug, categoryName, blogTitle }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb flex items-center text-sm md:text-base lg:text-lg">
        <li className="breadcrumb-item">
          <Link href="/">
            <span className="text-blue-500 hover:underline whitespace-nowrap">Home</span>
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link href={`/categories/${categorySlug}`}>
            <span className="text-blue-500 hover:underline whitespace-nowrap"> / {categoryName}</span>
          </Link>
        </li>
        {blogTitle && (
          <li className="breadcrumb-item active" aria-current="page">
            <span className="text-gray-500 whitespace-nowrap"> / {blogTitle}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
