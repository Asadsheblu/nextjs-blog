import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const headingStyles = {
  1: { fontSize: '1.5rem', color: '#3c4043', lineHeight: '1.2' }, // h1 style
  2: { fontSize: '1.25rem', color: '#3c4043', lineHeight: '1.3' }, // h2 style
  3: { fontSize: '1.125rem', color: '#3c4043', lineHeight: '1.4' }, // h3 style
  4: { fontSize: '1rem', color: '#3c4043', lineHeight: '1.5' }, // h4 style
  5: { fontSize: '0.875rem', color: '#3c4043', lineHeight: '1.6' }, // h5 style
  6: { fontSize: '0.75rem', color: '#3c4043', lineHeight: '1.7' }, // h6 style
};

const TableOfContents = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getMarginLeft = (level) => {
    if (windowWidth < 576) {
      return `${level * 10}px`;
    } else if (windowWidth < 768) {
      return `${level * 15}px`;
    } else if (windowWidth < 992) {
      return `${level * 20}px`;
    } else {
      return `${level * 25}px`;
    }
  };

  return (
    <div className="table-of-contents border mt-5 pb-5 pt-5 px-4 mb-5 rounded-lg shadow" style={{ backgroundColor: '#e1e1e1' }}>
      <div
        className="toc-header flex justify-between items-center cursor-pointer"
        onClick={toggleToc}
      >
        <h2 className="text-lg font-semibold" style={headingStyles[2]}>Table of Contents</h2>
        
      </div>
      {isOpen && (
        <div className="toc-list mt-4">
          {headings.map((item) => (
            <div key={item.id} style={{ marginLeft: getMarginLeft(item.level) }}>
              <a href={`#${item.id}`} className="hover:underline" style={headingStyles[item.level]}>
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
