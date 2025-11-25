import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, AppProvider, ProjectProvider } from './app/providers';
import { Layout } from './layouts/MainLayout/Layout';
import { Modals } from './components/modals/Modals';
import { AppRouter } from './router/AppRouter';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectProvider>
          <AppProvider>
            <Layout>
              <Modals />
              <AppRouter />
            </Layout>
          </AppProvider>
        </ProjectProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
