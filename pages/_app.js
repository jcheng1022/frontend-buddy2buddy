import '@/styles/globals.css'
import {QueryClient, QueryClientProvider} from "react-query";
import AuthContextProvider from "@/context/auth.context";
import AppContextProvider from "@/context/app.context";

import isToday from 'dayjs/plugin/isToday'
import dayjs from "dayjs";
import TaskContextProvider from "@/context/task.context";
import {useState} from "react";
import Head from "next/head";

dayjs.extend(isToday)

export default function App({ Component, pageProps }) {
  // const client = new QueryClient();
    const [client] = useState(() => new QueryClient())



    return(
      <>
          <Head>
              <title></title>
          </Head>
          <QueryClientProvider client={client}>
              <AuthContextProvider>
                  <AppContextProvider>
                      <TaskContextProvider>
                          <Component {...pageProps} />
                      </TaskContextProvider>
                  </AppContextProvider>
              </AuthContextProvider>
          </QueryClientProvider>
      </>
  )
}
