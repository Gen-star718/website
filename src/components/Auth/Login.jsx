import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Grid, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { auth } from '../../firebase'; // Firebase設定をインポート
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // エラーメッセージをリセット

    try {
      // Firebase Authenticationでサインイン
      await signInWithEmailAndPassword(auth, email, password);

      // ログイン成功後、ホームページにリダイレクト
      navigate('/');
      alert('ログインしました！');

    } catch (error) {
      console.error("ログインエラー:", error);
      // Firebaseのエラーコードに応じて日本語のメッセージを設定
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('メールアドレスまたはパスワードが間違っています。');
          break;
        case 'auth/invalid-email':
          setError('無効なメールアドレスです。');
          break;
        default:
          setError('ログインに失敗しました。もう一度お試しください。');
          break;
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                パスワードをお忘れですか？
              </Link> */}
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"アカウントをお持ちでないですか？ 新規登録"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;