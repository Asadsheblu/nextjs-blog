import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const TableOfContents = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to true to ensure it's open initially

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="table-of-contents mt-5 bg-gray-100 p-4 rounded-lg shadow-md">
      <div
        className="toc-header flex justify-between items-center cursor-pointer"
        onClick={toggleToc}
      >
        <h2 className="text-xl font-semibold">Table of Contents</h2>
        <div className="toc-toggle">
          {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </div>
      </div>
      {isOpen && (
        <div className="toc-list mt-4">
          {headings.map((item) => (
            <div key={item.id} className={`ml-${item.level * 2}`}>
              <a href={`#${item.id}`} className="text-blue-500 hover:underline">
                {item.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableOfContents;
