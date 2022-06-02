import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import useLocale from "../hooks/useLocale";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useLocale();

  return (
    <>
      <Head>
        <title>
          {t.common.choares} — {t.common.description}
        </title>
        <meta name="description" content={t.common.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster position="bottom-center" toastOptions={{ duration: 6000 }} />
    </>
  );
}

export default MyApp;
