import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';

const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">{value}</Typography>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AgencyDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {currentUser?.name || '事務所'}様 ダッシュボード
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* 統計サマリー */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="スカウト中の候補者" value="12名" icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="今週の新着" value="5名" icon={<SearchIcon color="primary" sx={{ fontSize: 40 }} />} />
        </Grid>

        {/* メインアクション */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<SearchIcon />}
              component={RouterLink} 
              to="/search" // TODO: 検索ページを作成
            >
              アイドルを探す
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component={RouterLink} 
              to="/scouts/manage" // TODO: スカウト管理ページを作成
            >
              スカウト管理
            </Button>
            <Button 
              variant="outlined"
              size="large"
              startIcon={<ChatIcon />}
              component={RouterLink} 
              to="/chats"
            >
              メッセージ一覧
            </Button>
          </Paper>
        </Grid>

        {/* TODO: おすすめの新人セクション */}
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
            おすすめの新人
          </Typography>
          {/* ここに候補者のカードリストなどを表示 */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AgencyDashboard;