import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: './Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Pretendard-SemiBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Pretendard-ExtraBold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
});
