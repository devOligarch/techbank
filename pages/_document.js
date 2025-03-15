import { Head, Html, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        {/* <meta
          name="google-site-verification"
          content="XWLSb2rrZqcaWtlwPLLTDPiB-Yu22Zw6QzFOWwIDWzk"
        /> */}
        <meta
          name="keywords"
          content="Tech Bank, Tech Bank website, buy smartphones Africa, phone trade-in Africa, Lipa Pole Pole phones"
        />

        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
