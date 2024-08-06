import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import the icons

const TableOfContents = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="table-of-contents"
      style={{
        background: '#f1f1f1',
        borderRadius: '5px',
        padding: '10px',
      }}
    >
      <div
        className="toc-header"
        onClick={toggleToc}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Table of Contents</h2>
        <div className="toc-toggle">
          {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </div>
      </div>
      {isOpen && (
        <div className="toc-list" style={{ marginTop: '10px' }}>
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
