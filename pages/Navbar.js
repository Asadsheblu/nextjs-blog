import React, { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import 'flag-icons/css/flag-icons.min.css'; // Import flag-icons CSS
import NProgress from 'nprogress'; // Add this line
import 'nprogress/nprogress.css'; // Add this line
import { useTranslation } from 'react-i18next';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const availableLanguages = [
  { code: 'en', name: 'English', flag: 'us' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'zh-HANT', name: '中国传统的', flag: 'cn' },
  { code: 'zh-HANS', name: '简体中文', flag: 'cn' },
  { code: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'gu', name: 'ગુજરાતી', flag: 'in' },
  { code: 'hi', name: 'हिंदी', flag: 'in' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'ja', name: '日本語', flag: 'jp' },
  { code: 'ko', name: '한국어', flag: 'kr' },
  { code: 'pl', name: 'Polski', flag: 'pl' },
  { code: 'pt', name: 'Português', flag: 'pt' },
  { code: 'ru', name: 'Русский', flag: 'ru' },
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
];

function Navbar() {
  const router = useRouter();
  const { t, i18n } = useTranslation('navbar');
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const changeLanguage = async (lang) => {
    if (availableLanguages.find(l => l.code === lang)) {
      setSelectedLanguage(lang);
      await i18n?.changeLanguage(lang);
      router.push(router.pathname, router.asPath, { locale: lang });
    }
  };

  useEffect(() => {
    if (router) {
      const handleRouteChange = () => NProgress.start();
      const handleRouteComplete = () => NProgress.done();

      router.events.on('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeComplete', handleRouteComplete);
      router.events.on('routeChangeError', handleRouteComplete);

      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
        router.events.off('routeChangeComplete', handleRouteComplete);
        router.events.off('routeChangeError', handleRouteComplete);
      };
    }
  }, [router]);

  const navigation = [
    { key: "Home", href: '/', dropdown: false },
    { key: 'About Us', href: '/about', dropdown: false },
    { key: 'Contact Us', href: '/contact', dropdown: false },
  ];

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    {/* <Link href='/'>
                      <Image
                        src={logo}
                        alt="YouTube Tools Logo"
                        height="70"
                        width="150"
                        priority 
                      />
                    </Link> */}
                    Blog
                  </div>
                  <div className="hidden sm:block sm:ml-6 mx-auto">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link key={item.key} href={item.href} className={classNames(
                          router.pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-red-500 hover:bg-gray-700',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}>
                          {t(item.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className=" flex items-center inset-y-0 right-0 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <div className="relative inline-block text-left lan mr-4 hidden sm:flex block">
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="inline-flex lan justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className={`fi fi-${availableLanguages.find(l => l.code === selectedLanguage)?.flag}`} />
                          <span className="ml-2">{availableLanguages.find(l => l.code === selectedLanguage)?.name}</span>
                          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            {availableLanguages.map(lang => (
                              <Menu.Item key={lang.code}>
                                {({ active }) => (
                                  <button
                                    onClick={() => changeLanguage(lang.code)}
                                    className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm')}
                                  >
                                    <span className={`fi fi-${lang.flag} mr-2`}></span>
                                    {lang.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  
                  <Link href="/login">
                    <button className="text-gray-300 bg-red-700 hover:text-red-500 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {t('Login')}
                    </button>
                  </Link>
               
                </div>
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link key={item.key} href={item.href} className={classNames(
                    router.pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-red-500 hover:bg-gray-700',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}>
                    {t(item.key)}
                  </Link>
                ))}
                <div className="flex lan items-center justify-center lan mt-4 space-x-4">
                  <Menu as="div" className="relative inline-block lan text-left">
                    <div>
                      <Menu.Button className="inline-flex lan justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className={`fi fi-${availableLanguages.find(l => l.code === selectedLanguage)?.flag}`} />
                        <span className="ml-2">{availableLanguages.find(l => l.code === selectedLanguage)?.name}</span>
                        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {availableLanguages.map(lang => (
                            <Menu.Item key={lang.code}>
                              {({ active }) => (
                                <button
                                  onClick={() => changeLanguage(lang.code)}
                                  className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm')}
                                >
                                  <span className={`fi fi-${lang.flag} mr-2`}></span>
                                  {lang.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default Navbar;
