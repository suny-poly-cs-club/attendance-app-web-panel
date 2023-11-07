import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {AuthProvider} from './providers/auth.tsx';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import './index.css';

dayjs.extend(LocalizedFormat);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
