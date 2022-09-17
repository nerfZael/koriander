import { ReactElement } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps): ReactElement<any, any> {
  return (
    <Component {...pageProps} />
  );
}

export default MyApp;
