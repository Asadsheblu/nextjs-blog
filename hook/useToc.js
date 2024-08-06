import { useEffect, useState } from 'react';
import { parse } from 'node-html-parser';

export const useToc = (htmlContent) => {
  const [headings, setHeadings] = useState([]);
  const [contentWithIds, setContentWithIds] = useState(htmlContent);

  useEffect(() => {
    if (htmlContent) {
      const root = parse(htmlContent);
      const headingsArray = [];
      root.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.setAttribute('id', id);
        headingsArray.push({
          id,
          title: heading.text,
          level: parseInt(heading.tagName[1], 10),
        });
      });
      setHeadings(headingsArray);
      setContentWithIds(root.toString());
    }
  }, [htmlContent]);

  return [headings, contentWithIds];
};
