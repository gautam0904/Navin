import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, AppProvider, ProjectProvider } from './app/providers';
import { FileExplorerProvider } from './contexts/FileExplorerContext';
import { GitProvider } from './contexts/GitContext';
import { Layout } from './layouts/MainLayout/Layout';
import { Modals } from './components/modals/Modals';
import { AppRouter } from './router/AppRouter';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectProvider>
          <FileExplorerProvider>
            <GitProvider>
              <AppProvider>
                <Layout>
                  <Modals />
                  <AppRouter />
                </Layout>
              </AppProvider>
            </GitProvider>
          </FileExplorerProvider>
        </ProjectProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
