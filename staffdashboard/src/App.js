import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Schedule from './pages/Schedule';
import ResidentRegistration from './pages/ResidentRegistration';
import Settings from './pages/Settings';
import Login from './pages/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B6455',
    },
    secondary: {
      main: '#6B8E4E',
    },
  },
});

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/resident-registration" element={<ResidentRegistration />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
