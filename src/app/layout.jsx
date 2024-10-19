"use client"; // Make sure the root layout is also a client component

import AuthProvider from '@/components/AuthProvider';
import store from '@/store/store';
import { Provider } from 'react-redux';

function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Lawyer</title>
      </head>
      <body>
        <Provider store={store}>
          <AuthProvider> {/* Wrapping your app with AuthProvider */}
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
