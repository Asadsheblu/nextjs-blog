import { useState, useEffect } from 'react';

export const useToc = (content) => {
  const [toc, setToc] = useState([]);
  const [updatedContent, setUpdatedContent] = useState(content);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    const tocItems = headings.map((heading, index) => {
      const id = `toc-${index}`;
      heading.id = id;
      return {
        id,
        title: heading.innerText,
        level: parseInt(heading.tagName.replace('H', ''), 10),
      };
    });

    setToc(tocItems);
    setUpdatedContent(doc.body.innerHTML);
  }, [content]);

  return [toc, updatedContent];
};
