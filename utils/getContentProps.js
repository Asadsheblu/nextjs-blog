import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchContent, fetchReviews } from '../contexts/ContentContext';

export const getContentProps = async (category, locale, req) => {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

  const contentProps = await fetchContent(category, locale, host, protocol, () => {});
  const reviews = await fetchReviews(category, host, protocol, () => {});

  return {
    props: {
      ...contentProps,
      reviews,
      ...(await serverSideTranslations(locale, [
        'common',
        'tagextractor',
        'navbar',
        'titlegenerator',
        'trending',
        'videoDataViewer',
        'banner',
        'logo',
        'search',
        'embed',
        'hashtag',
        'calculator',
        'thumbnail',
        'tdextractor',
        'channelId',
        'monetization',
        'keyword',
        'footer',
        'pricing',
        'description',
      ])),
    },
  };
};
