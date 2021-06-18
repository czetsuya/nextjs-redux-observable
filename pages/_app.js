import Head from 'next/head';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {useStore} from 'redux/ApplicationStore.js';

export default function App({Component, pageProps}) {
  const {store, persistor} = useStore(pageProps.initialReduxState);
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
