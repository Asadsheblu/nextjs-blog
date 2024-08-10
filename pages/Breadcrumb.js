import Link from 'next/link';

const Breadcrumb = ({ categoryName, blogTitle }) => {
  // Function to convert category name to a slug
  const generateSlug = (name) => {
    if (!name) {
      return 'unknown-category'; // Fallback slug if name is undefined or null
    }
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/ /g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove all non-word characters except hyphens
  };

  const categorySlug = generateSlug(categoryName);

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
            <span className="text-blue-500 hover:underline whitespace-nowrap"> / {categoryName || 'Unknown Category'}</span>
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
