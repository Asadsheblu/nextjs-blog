import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaTachometerAlt,
  FaUsers,
  FaInfoCircle,
  FaLock,
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
  FaFolderOpen,
  FaBlog,
  FaPlusCircle,
  FaBell,
  FaSearch,
  FaStarHalfAlt,
  FaKey,
  FaInfo,
  FaFile,
} from 'react-icons/fa';
import { FaDownLeftAndUpRightToCenter } from 'react-icons/fa6';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentManagementOpen, setContentManagementOpen] = useState(false);
  const [apiManagementOpen, setApiManagementOpen] = useState(false);
  const [importantManagementOpen, setImportantManagementOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      router.pathname === '/dashbaord/categories' ||
      router.pathname === '/dashbaord/blogs' ||
      router.pathname === '/dashbaord/all-blogs'
    ) {
      setContentManagementOpen(true);
    }
   
  }, [router.pathname]);

  const isActiveRoute = (route) => {
    return router.pathname === route;
  };

  const toggleContentManagement = () => {
    setContentManagementOpen(!contentManagementOpen);
  };

  const toggleApiManagement = () => {
    setApiManagementOpen(!apiManagementOpen);
  };

  const toggleImportantManagement = () => {
    setImportantManagementOpen(!importantManagementOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-white shadow-lg transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="text-2xl font-semibold text-gray-700">Admin dashbaord</div>
        </div>
        <nav className="mt-10">
          <Link href="/dashbaord/dashbaord" passHref>
            <p
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute('/dashbaord/dashbaord')
                  ? 'bg-gray-300 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <FaTachometerAlt className="mr-3 text-info" /> <span className="mx-3">dashbaord</span>
            </p>
          </Link>
        
          <div>
            <div
              onClick={toggleContentManagement}
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer rounded-md ${
                contentManagementOpen
                  ? 'bg-gray-300 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <FaFolderOpen className="mr-3 text-primary" /> <span className="mx-3">Blogs</span>
              <span className="ml-auto">{contentManagementOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
            </div>
            {contentManagementOpen && (
              <div className="ml-6">
                <Link href="/dashbaord/categories" passHref>
                  <p
                    className={`flex items-center mt-2 py-2 px-6 cursor-pointer rounded-md ${
                      isActiveRoute('/dashbaord/categories')
                        ? 'bg-gray-300 text-gray-700'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <FaPlusCircle className="mr-3" /> <span className="mx-3">Add Categories</span>
                  </p>
                </Link>
                <Link href="/dashbaord/blogs" passHref>
                  <p
                    className={`flex items-center mt-2 py-2 px-6 cursor-pointer rounded-md ${
                      isActiveRoute('/dashbaord/blogs')
                        ? 'bg-gray-300 text-gray-700'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <FaPlusCircle className="mr-3" /> <span className="mx-3">Add Blog</span>
                  </p>
                </Link>
                <Link href="/dashbaord/all-blogs" passHref>
                  <p
                    className={`flex items-center mt-2 py-2 px-6 cursor-pointer rounded-md ${
                      isActiveRoute('/dashbaord/all-blogs')
                        ? 'bg-gray-300 text-gray-700'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <FaBlog className="mr-3" /> <span className="mx-3">All Blogs</span>
                  </p>
                </Link>
              </div>
            )}
          </div>
        
      
          <Link href="/dashbaord/comment" passHref>
            <p
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute('/dashbaord/comment')
                  ? 'bg-gray-300 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <FaDownLeftAndUpRightToCenter className="mr-3 text-red-500" /> <span className="mx-3">Commnet</span>
            </p>
          </Link>
    
          <Link href="/dashbaord/importExport" passHref>
            <p
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute('/dashbaord/importExport')
                  ? 'bg-gray-300 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <FaDownLeftAndUpRightToCenter className="mr-3 text-red-500" /> <span className="mx-3">Export & Import</span>
            </p>
          </Link>
          <Link href="/dashbaord/media" passHref>
            <p
              className={`flex items-center mt-4 py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute('/dashbaord/media')
                  ? 'bg-gray-300 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <FaFile className="mr-3 text-red-500" /> <span className="mx-3">Media</span>
            </p>
          </Link>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-gray-200">
          <div className="flex items-center">
            <button className="text-gray-500 focus:outline-none lg:hidden" onClick={() => setSidebarOpen(true)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
                placeholder="Search"
              />
              <FaSearch className="absolute top-3 right-3 text-gray-400" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
