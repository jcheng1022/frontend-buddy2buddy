import '@/styles/globals.css'
import {QueryClient, QueryClientProvider} from "react-query";
import AuthContextProvider from "@/context/auth.context";
import AppContextProvider from "@/context/app.context";

import isToday from 'dayjs/plugin/isToday'
import dayjs from "dayjs";
import {useState} from "react";
import Head from "next/head";
import PlannerContext from "@/context/planner.context";
import NotificationProvider from "@/components/common/NotificationProvider";

dayjs.extend(isToday)

export default function App({ Component, pageProps }) {
  // const client = new QueryClient();
    const [client] = useState(() => new QueryClient())



    return(
      <>
          <Head>
              <title> Buddy2Buddy</title>
          </Head>
          <QueryClientProvider client={client}>
              <AuthContextProvider>
                  <AppContextProvider>
                         <PlannerContext>
                             <NotificationProvider>
                                 <Component {...pageProps} />
                             </NotificationProvider>
                         </PlannerContext>
                  </AppContextProvider>
              </AuthContextProvider>
          </QueryClientProvider>
      </>
  )
}
