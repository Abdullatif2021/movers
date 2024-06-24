import React from 'react';
import { ConfigProvider } from 'antd';
import arEg from 'antd/lib/locale/ar_EG';
import enUS from 'antd/lib/locale/en_US';
import GlobalStyle from './styles/GlobalStyle';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@fontsource/cairo';
import '@fontsource/lato';
import { CookiesProvider } from 'react-cookie';

const App: React.FC = () => {
  const { language, direction } = useLanguage();
  const theme = useAppSelector((state) => state.theme.theme);

  useThemeWatcher();

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <meta name="theme-color" content={themeObject[theme].primary} />
          <GlobalStyle />
          <ConfigProvider locale={language === 'en' ? enUS : arEg} direction={direction}>
            <AppRouter />
          </ConfigProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
