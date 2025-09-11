import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from './context/AuthContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

// コンポーネントのインポート
import HomePage from './components/Home/Home';
import LoginPage from './components/Auth/Login';
import SignupPage from './components/Auth/Signup';
import PrivateRoute from './components/Auth/PrivateRoute';
import IdolDashboard from './components/Dashboard/IdolDashboard';
import AgencyDashboard from './components/Dashboard/AgencyDashboard';
import ProfileEdit from './components/Profile/ProfileEdit';
import VideoManager from './components/Videos/VideoManager';
import SearchPage from './components/Search/SearchPage';
import ProfileView from './components/Profile/ProfileView';
import ChatRoom from './components/Chat/ChatRoom';
import ChatList from './components/Chat/ChatList';


// MUIのデフォルトテーマを作成
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// ログイン状態に応じてボタンを出し分けるコンポーネント
function AuthButtons() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      alert('ログアウトしました。');
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      alert('ログアウトに失敗しました。');
    }
  };

  if (currentUser === undefined) {
    return <CircularProgress color="inherit" size={24} />;
  }

  const dashboardPath = currentUser?.userType === 'idol' 
    ? '/idol/dashboard' 
    : currentUser?.userType === 'agency' 
    ? '/agency/dashboard' 
    : '/';

  return (
    <>
      {currentUser ? (
        <>
          <Button color="inherit" component={RouterLink} to={dashboardPath}>マイページ</Button>
          <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
        </>
      ) : (
        <>
          <Button color="inherit" component={RouterLink} to="/login">ログイン</Button>
          <Button color="inherit" component={RouterLink} to="/signup">新規登録</Button>
        </>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
              Idol Connect
            </Typography>
            <AuthButtons />
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/idol/dashboard" element={<PrivateRoute><IdolDashboard /></PrivateRoute>} />
          <Route path="/agency/dashboard" element={<PrivateRoute><AgencyDashboard /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><ProfileEdit /></PrivateRoute>} />
          <Route path="/videos/manage" element={<PrivateRoute><VideoManager /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
          <Route path="/chat/:chatId" element={<PrivateRoute><ChatRoom /></PrivateRoute>} />
          <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;