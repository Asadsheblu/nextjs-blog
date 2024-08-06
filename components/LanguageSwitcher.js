// components/LanguageSwitcher.js
import { useRouter } from 'next/router';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locales, locale, asPath } = router;

  return (
    <div>
      {locales.map((loc) => (
        <Link href={asPath} locale={loc} key={loc}>
          <button disabled={locale === loc}>{loc}</button>
        </Link>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
