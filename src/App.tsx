import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { Layout } from './components/layout/Layout';
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
