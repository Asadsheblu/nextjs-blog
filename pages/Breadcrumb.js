import Link from 'next/link';

const Breadcrumb = ({ blogTitle }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb flex items-center text-sm md:text-base lg:text-lg">
        <li className="breadcrumb-item">
          <Link href="/">
            <span className="text-blue-500 hover:underline whitespace-nowrap">Home</span>
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link href="/blog">
            <span className="text-blue-500 hover:underline whitespace-nowrap"> / Blog</span>
          </Link>
        </li>
        {blogTitle && (
          <li className="breadcrumb-item active" aria-current="page">
            <span className="text-gray-500 whitespace-nowrap"> / {blogTitle}</span>
          </li>
        )}
      </ol>
      <style>{`
        .breadcrumb {
          list-style: none;
          padding: 0;
          white-space: nowrap; /* Ensure the breadcrumb items stay in one line */
        }
        .breadcrumb-item {
          margin-right: 0.5rem;
        }
        .breadcrumb-item + .breadcrumb-item::before {
          content: "";
          margin-right: 0.5rem;
        }
      `}</style>
    </nav>
  );
};

export default Breadcrumb;
