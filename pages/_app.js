import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "@mantine/notifications/styles.css";
import "instantsearch.css/themes/satellite.css";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import "leaflet/dist/leaflet.css";

import "react-toastify/dist/ReactToastify.css";

import { SessionProvider } from "next-auth/react";
import { createTheme, MantineProvider } from "@mantine/core";
import { NavigationProgress } from "@mantine/nprogress";

import { InstantSearch } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";

import { withUrqlClient } from "next-urql";
import { Notifications } from "@mantine/notifications";
import RouteLoader from "@/components/RouterLoader";

import UserProvider from "@/context/User";

const theme = createTheme({
  fontFamily: "EudoxusSans",
  primaryColor: "tech-bank",
  colors: {
    "tech-bank": [
      "#FFF4E5", // 100 - Lightest
      "#FFE0B2", // 200
      "#FFCC80", // 300
      "#FFB74D", // 400
      "#FFA726", // 500 - Primary Orange
      "#FB8C00", // 600
      "#F57C00", // 700
      "#EF6C00", // 800
      "#E65100", // 900 - Darkest
    ],
  },
});

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
);

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX}
      >
        <SessionProvider session={session}>
          <MantineProvider theme={theme}>
            <Notifications />
            <NavigationProgress color="red" initialProgress={20} />
            <main>
              <UserProvider>
                <RouteLoader />
                <Component {...pageProps} />
              </UserProvider>
            </main>
          </MantineProvider>
        </SessionProvider>
      </InstantSearch>
    </>
  );
}

export default withUrqlClient((_ssrExchange, ctx) => ({
  url: process.env.NEXT_PUBLIC_BACKEND_SERVER,
}))(App);
