import Layout from "@/components/layout/Layout";
import Providers from "@/components/_app/Providers";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers pageProps={pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  );
}
