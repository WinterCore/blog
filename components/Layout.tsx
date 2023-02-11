import React from 'react';
import { MetaProps } from '../types/layout';
import Head from './Head';
import Navigation from './Navigation';
import ThemeSwitch from './ThemeSwitch';

type LayoutProps = {
  children: React.ReactNode;
  wavy?: boolean;
  hero?: JSX.Element;
  customMeta?: MetaProps;
};

export const WEBSITE_HOST_URL = 'https://nextjs-typescript-mdx-blog.vercel.app';

const Layout = ({ children, wavy, customMeta, hero }: LayoutProps): JSX.Element => {
  return (
    <div className="bg-sky-100 main-bg flex flex-col min-h-screen">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
          .dark .main-bg {
            background: rgb(20,26,40);
            background: linear-gradient(0deg, rgba(20,26,40,1) 0%, rgba(62,81,122,1) 21%, rgba(62,81,122,1) 75%, rgba(20,26,40,1) 100%);
          }
          .footer-links a {
              color: inherit;
          }
      `}</style>
      <Head customMeta={customMeta} />
        <header>
          <div className="max-w-5xl px-8 mx-auto">
            <div className="flex items-center justify-between py-4">
              <Navigation />
              <ThemeSwitch />
            </div>
          </div>
        </header>
        {! wavy && (
            <>
              <div className="min-h-[200px] flex flex-col justify-end">
                  {hero}
              </div>
              <div className="h-[72px] bg-white dark:bg-[#242F47]"></div>
            </>
        )}
        {wavy && (
            <>
              <div className="h-[148px] max-w-5xl px-8 py-4 mx-auto">
              </div>
              <div className="w-full mt-[-172px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <path className="fill-white dark:fill-[#242F47]" fillOpacity="1" d="M0,64L48,85.3C96,107,192,149,288,181.3C384,213,480,235,576,218.7C672,203,768,149,864,154.7C960,160,1056,224,1152,234.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>

              </div>
            </>
        )}
        <main className="flex-1 pb-20 bg-white dark:bg-[#242F47]">
          <div className="max-w-5xl px-8 py-4 mx-auto">{children}</div>
        </main>
        <footer className="py-8">
          <div className="max-w-5xl px-8 py-4 mx-auto flex justify-between">
            <div></div>
            <div className="text-sm footer-links">
              <b className="text-gray-500 dark:text-gray-300">Links</b>
              <ul className="mt-4 text-black dark:text-white flex flex-col gap-2">
                  <li><a href="https://github.com/WinterCore" target="_blank" className="text-inherit" rel="noreferrer">Github</a></li>
                  <li><a href="mailto:hogobbl@gmail.com" target="_blank" className="text-inherit" rel="noreferrer">Contact</a></li>
              </ul>
            </div>
          </div>
        </footer>

    </div>
  );
};

export default Layout;
