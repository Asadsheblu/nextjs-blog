import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ClipLoader } from 'react-spinners';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Breadcrumb from '../Breadcrumb';
import Comments from '../../components/Comments';
import { useToc } from '../../hook/useToc';
import TableOfContents from '../../components/TableOfContents';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';

// Helper function to get the correct title and content
const getTitle = (translation) => translation.title || translation.Title || '';
const getContent = (translation) => translation.content || translation.Content || '';

const insertTocBeforeFirstHeading = (content, tocHtml) => {
  const firstHeadingIndex = content.search(/<h[1-6][^>]*>/);
  if (firstHeadingIndex === -1) return content; // No heading found, return original content

  const beforeFirstHeading = content.slice(0, firstHeadingIndex);
  const afterFirstHeading = content.slice(firstHeadingIndex);

  return `${beforeFirstHeading}${tocHtml}${afterFirstHeading}`;
};

const BlogPost = ({ initialBlog }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { locale } = router;
  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [schemaData, setSchemaData] = useState(null);
  const [breadcrumbSchema, setBreadcrumbSchema] = useState(null);

  useEffect(() => {
    if (!initialBlog && slug) {
      const fetchData = async () => {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
          const { data } = await axios.get(apiUrl);
          const blogs = data;

          const blog = blogs.find(blog =>
            Object.values(blog.translations).some(translation => translation.slug === slug)
          );

          if (blog) {
            setBlog(blog);
          }

        } catch (error) {
          console.error('Error fetching blogs:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [slug, initialBlog]);

  const translation = blog?.translations ? blog.translations[locale] || {} : {};
  const content = getContent(translation);
  const [toc, updatedContent] = useToc(content);

  // Insert TOC before the first heading
  const tocHtml = toc ? ReactDOMServer.renderToStaticMarkup(<TableOfContents headings={toc} />) : '';
  const contentWithToc = insertTocBeforeFirstHeading(updatedContent, tocHtml);

  useEffect(() => {
    if (blog && blog.translations) {
      const translation = blog.translations[locale] || {};
      const title = getTitle(translation);
      const description = translation.description || translation.Description || '';
      const image = translation.image || "https://example.com/photos/1x1/photo.jpg";

      if (content) {
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": title,
          "image": [image],
          "datePublished": blog.createdAt,
          "dateModified": blog.updatedAt || blog.createdAt,
          "author": {
            "@type": "Person",
            "name": blog.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "ytubetools",
            "logo": {
              "@type": "ImageObject",
              "url": "https://example.com/logo.jpg"
            }
          },
          "description": description,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`
          }
        };

        const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.ytubetools.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Blog",
              "item": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": title,
              "item": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`
            }
          ]
        };

        setSchemaData(schemaData);
        setBreadcrumbSchema(breadcrumbSchema);
      }
    }
  }, [blog, locale, slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!blog) {
    return <p className="text-red-500">No content available for this language.</p>;
  }

  const postContent = blog.translations ? blog.translations[locale] : null;

  if (!postContent) {
    return <p className="text-red-500">No content available for this language.</p>;
  }

  const shareUrl = `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/blog/${slug}`;
  const title = getTitle(postContent);

  return (
    <div className="relative">
      <Head>
        <title>{title} | ytubetools</title>
        <meta name="description" content={postContent.description || postContent.Description || ''} />
        <meta name="keywords" content={`SEO, Blog, ytubetools, ${title}`} />
        <meta name="author" content={blog.author} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={postContent.description || postContent.Description || ''} />
        <meta property="og:image" content={postContent.image || "https://example.com/photos/1x1/photo.jpg"} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={postContent.description || postContent.Description || ''} />
        <meta name="twitter:image" content={postContent.image || "https://example.com/photos/1x1/photo.jpg"} />
        <meta name="twitter:site" content="@ytubetools" />

        {schemaData && (
          <script type="application/ld+json">
            {JSON.stringify(schemaData)}
          </script>
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {typeof window !== 'undefined' && blog.translations && Object.keys(blog.translations).map(lang => (
          <link
            key={lang}
            rel="alternate"
            href={`https://${window.location.host}/blog/${blog.translations[lang].slug}`}
            hrefLang={lang}
          />
        ))}
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-grow order-1 lg:order-2">
            <Breadcrumb blogTitle={title} />
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
              <div className="p-6 bg-white border-b border-gray-200">
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <div className="my-4" dangerouslySetInnerHTML={{ __html: contentWithToc }} />
                <div className="my-8">
                  <h3 className="text-lg font-bold mb-4">Share this post</h3>
                  <div className="flex space-x-4">
                    <FacebookShareButton url={shareUrl} quote={title}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={title}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} title={title}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                  </div>
                </div>
              </div>
            </div>
            <Comments slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale, params, req }) {
  try {
    const { slug } = params;
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000'; // Default to localhost if not provided
    const apiUrl = `${protocol}://${host}/api/blogs`;

    const { data } = await axios.get(apiUrl);

    const blogs = data;

    const blog = blogs.find(blog =>
      Object.values(blog.translations).some(translation => translation.slug === slug)
    );

    if (!blog) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialBlog: blog,
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer'])),
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return {
      notFound: true,
    };
  }
}

export default BlogPost;
