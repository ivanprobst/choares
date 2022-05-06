import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
// import AuthGuardian from "../components/AuthGuardian";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster position="bottom-center" toastOptions={{ duration: 6000 }} />
    </>
  );
}

export default MyApp;
