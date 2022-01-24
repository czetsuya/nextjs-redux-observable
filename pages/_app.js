import Head from 'next/head';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {useStore} from 'redux/ApplicationStore.js';
import {useEffect} from "react";
import NProgress from 'nprogress'
import {useRouter} from "next/router";

export default function App({Component, pageProps}) {

  const {store, persistor} = useStore(pageProps.initialReduxState);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return (
      <Provider store={store}>
        <PersistGate loading={<div/>} persistor={persistor}>
          <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
  );
}
