import React from 'react';
import { Box, Button, Container, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';

const Home = () => {
  return (
    <Box>
      {/* ヒーローセクション */}
      <Paper 
        sx={{ 
          py: 10, 
          textAlign: 'center', 
          backgroundColor: 'primary.main', 
          color: 'white',
          mb: 4,
          borderRadius: 0,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            夢への一歩を、ここから。
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Idol Connectは、未来のスターと芸能事務所をつなぐプラットフォームです。
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/signup"
          >
            今すぐ無料で始める
          </Button>
        </Container>
      </Paper>

      {/* 特徴セクション */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          サービスの特徴
        </Typography>
        <Grid container spacing={4}>
          {/* アイドル志望者向け */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <StarIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  アイドル志望者のあなたへ
                </Typography>
                <Typography variant="body1">
                  プロフィールとパフォーマンス動画を登録して、全国の事務所にあなたをアピール。スカウトのチャンスが待っています。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* 事務所向け */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  芸能事務所の皆様へ
                </Typography>
                <Typography variant="body1">
                  簡単な検索で、才能あふれる未来のスターを発掘。効率的なスカウト活動で、新たな才能との出会いをサポートします。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* TODO: 注目の新人セクション */}
    </Box>
  );
};

export default Home;
