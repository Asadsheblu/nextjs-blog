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
import ReactDOMServer from 'react-dom/server';
import { format } from 'date-fns';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import AuthorInfo from '../../components/AuthorCard';
import { useTranslation } from 'react-i18next';

const getTitle = (translation) => translation.title || translation.Title || '';
const getContent = (translation) => translation.content || translation.Content || '';

const insertTocBeforeFirstHeading = (content, tocHtml) => {
  const firstHeadingIndex = content.search(/<h[1-6][^>]*>/);
  if (firstHeadingIndex === -1) return content; // No heading found, return original content

  const beforeFirstHeading = content.slice(0, firstHeadingIndex);
  const afterFirstHeading = content.slice(firstHeadingIndex);

  return `${beforeFirstHeading}${tocHtml}${afterFirstHeading}`;
};

const BlogPost = ({ initialBlog, authorData, relatedBlogs }) => {
  const { t } = useTranslation('blog');
  const router = useRouter();
  const { slug } = router.query;
  const { locale } = router;
  const [blog, setBlog] = useState(initialBlog);
  const [author, setAuthor] = useState(authorData?.author);
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

            // Fetch author information
            const authorResponse = await axios.get(`/api/authors?name=${blog.author}`);
            if (authorResponse.data.length > 0) {
              setAuthor(authorResponse.data[0]);
            }
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

  const tocHtml = toc ? ReactDOMServer.renderToStaticMarkup(<TableOfContents headings={toc} />) : '';
  const contentWithToc = insertTocBeforeFirstHeading(updatedContent, tocHtml);

  const categoryName = translation.category || 'Blog';

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
              "name": categoryName,
              "item": `https://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/categories/${categoryName}`
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
    return <p className="text-red-500">{t('No content available for this language.')}</p>;
  }

  const postContent = blog.translations ? blog.translations[locale] : null;

  if (!postContent) {
    return <p className="text-red-500">{t('No content available for this language.')}</p>;
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
            <Breadcrumb categoryName={categoryName} blogTitle={title} />
            <h1 className="md:text-5xl font-bold mb-4">{title}</h1>
            <h6>{t('Updated on')} {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</h6> {/* Updated format */}
            <AuthorInfo data={authorData}/>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
              <div className="p-6 bg-white border-b border-gray-200">
              
                <div className="my-4" dangerouslySetInnerHTML={{ __html: contentWithToc }} />
                <div className="my-8">
                  <h3 className="text-lg font-bold mb-4">{t('Share this post')}</h3>
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
            <div className="p-6 mb-3 bg-blue-50 md:w-full rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">{t('About The Author')}</h2>
              <hr/>
              <div className="flex items-center">
                <img 
                  src={author?.image} 
                  alt={author?.name ? `Profile picture of ${author.name}` : 'Author image'} 
                  className="w-40 h-40 rounded-full mr-4" 
                />
                <div>
                  <h3 className="text-xl font-bold pt-3">{author?.name}</h3>
                  <p className="text-gray-700">{author?.bio}</p>
                  <div className="flex mt-2 space-x-4">
                    {author?.socialLinks?.facebook && (
                      <a href={author.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={24} />
                      </a>
                    )}
                    {author?.socialLinks?.twitter && (
                      <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter size={24} />
                      </a>
                    )}
                    {author?.socialLinks?.linkedin && (
                      <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Blogs Section */}
            {relatedBlogs?.length > 0 && (
  <div className="my-8">
    <h2 className="text-2xl font-bold mb-4">{t('Related Blogs')}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {relatedBlogs.map((relatedBlog, index) => {
        const relatedTranslation = relatedBlog.translations[locale];
        if (!relatedTranslation) return null;
        return (
          <div key={index} className="bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className='h-[270px] rounded'>
              <Image
                src={relatedTranslation?.image || '/placeholder.jpg'}
                alt={relatedTranslation?.title || 'Related blog image'}
                width={400}
                height={270}
                className='blog-img rounded'
                quality={50} // Image quality reduced
              />
            </div>
            <div className='p-4'>
              <h3 className="text-xl font-semibold mb-2">
                <a href={`/blog/${relatedTranslation.slug}`} className="text-blue-600 hover:underline">
                  {relatedTranslation.title}
                </a>
              </h3>
              <p className="text-gray-600 mb-2">{relatedTranslation.description?.substring(0, 100)}...</p>
              <a href={`/blog/${relatedTranslation.slug}`} className="text-blue-500 hover:underline">
                {t("Read More")}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

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

    // Find the blog based on the slug
    const blog = blogs.find(blog =>
      Object.values(blog.translations).some(translation => translation.slug === slug)
    );

    if (!blog) {
      return {
        notFound: true,
      };
    }

    // Get the slug for the current locale
    const currentTranslation = blog.translations[locale];
    if (!currentTranslation) {
      return {
        notFound: true,
      };
    }

    const currentSlug = currentTranslation.slug;

    // Redirect to the correct slug if the slug does not match
    if (currentSlug !== slug) {
      return {
        redirect: {
          destination: `/blog/${currentSlug}`,
          permanent: false,
        },
      };
    }

    // Fetch authors and filter based on roles
    const authorResponse = await axios.get(`${protocol}://${host}/api/authors`);
    const authors = authorResponse.data;

    // Filter authors based on roles
    const author = authors.find(author => author.role === 'Author' && author.name === blog.author);
    const editor = authors.find(author => author.role === 'Editor' && author.name === blog.editor);
    const developer = authors.find(author => author.role === 'Developer' && author.name === blog.developer);

    // Fetch related blogs from the same category
    const categoryBlogs = blogs.filter(
      b => b !== blog && Object.values(b.translations).some(translation => translation.category === blog.translations[locale]?.category)
    ).slice(0, 3); // Limiting to 3 related blogs

    return {
      props: {
        initialBlog: blog,
        authorData: {
          author: author || null,
          editor: editor || null,
          developer: developer || null,
        },
        relatedBlogs: categoryBlogs,
        ...(await serverSideTranslations(locale, ['blog', 'navbar', 'footer'])),
      },
    };
  } catch (error) {
    console.error('Error fetching blogs or authors:', error.message);
    return {
      notFound: true,
    };
  }
}

export default BlogPost;
