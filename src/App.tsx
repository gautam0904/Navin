import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { Layout } from './components/Layout';
import { Modals } from './components/Modals';
import { AppRouter } from './router/AppRouter';

const App = () => {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <AppProvider>
          <Layout>
            <Modals />
            <AppRouter />
          </Layout>
        </AppProvider>
      </ProjectProvider>
    </BrowserRouter>
  );
};

export default App;
