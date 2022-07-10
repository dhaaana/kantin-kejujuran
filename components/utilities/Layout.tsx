import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Toast from './Toast';
import Link from 'next/link';

interface LayoutProps {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  isLoading,
  children,
}: LayoutProps): JSX.Element {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Kantin Kejujuran - {title}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Toast isLoading={isLoading} />
      <div className='bg-purple-50 flex flex-col items-center min-h-screen px-20 py-10'>
        <div className='border-b-2 border-b-purple-300 flex items-end justify-between pb-3 w-full'>
          <div className='w-1/2'>
            <h1>Kantin Kejujuran</h1>
            <h4>SD SEA Sentosa</h4>
          </div>
          <div className='flex gap-4 justify-end w-1/2'>
            <Link href={'/'}>
              <span
                className={`hover:border-b-2 hover:border-b-purple-700 cursor-pointer hover:font-semibold ${
                  router.asPath === '/' &&
                  'font-semibold border-b-2 border-b-purple-700'
                }`}
              >
                Store
              </span>
            </Link>
            <Link href={'/balance'}>
              <span
                className={`hover:border-b-2 hover:border-b-purple-700 cursor-pointer hover:font-semibold ${
                  router.asPath === '/balance' &&
                  'font-semibold border-b-2 border-b-purple-700'
                }`}
              >
                Balance Box
              </span>
            </Link>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}