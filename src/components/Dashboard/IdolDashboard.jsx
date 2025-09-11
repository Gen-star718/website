import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, LinearProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

const IdolDashboard = () => {
  const { currentUser } = useAuth();

  // プロフィールの完成度（ダミーデータ）
  const profileCompletion = 60;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ようこそ、{currentUser?.name || 'ユーザー'}さん
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12}>
            <Button 
                variant="contained" 
                component={RouterLink} 
                to="/chats"
                startIcon={<ChatIcon />}
              >
                メッセージ一覧
              </Button>
        </Grid>
        {/* プロフィールカード */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                プロフィール情報
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                完成度: {profileCompletion}%
              </Typography>
              <LinearProgress variant="determinate" value={profileCompletion} sx={{ mb: 3 }} />
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/profile/edit" // TODO: プロフィール編集ページを作成
              >
                プロフィールを編集する
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 動画管理カード */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                動画管理
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                自己PR動画をアップロード・管理します。
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/videos/manage" // TODO: 動画管理ページを作成
              >
                動画を管理する
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IdolDashboard;