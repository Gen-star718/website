import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, TextField, Paper, Button } from '@mui/material';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link as RouterLink } from 'react-router-dom';

const SearchPage = () => {
  const [allIdols, setAllIdols] = useState([]);
  const [filteredIdols, setFilteredIdols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', prefecture: '' });

  useEffect(() => {
    const fetchIdols = async () => {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('userType', '==', 'idol'));
      const querySnapshot = await getDocs(q);
      const idolsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllIdols(idolsData);
      setFilteredIdols(idolsData);
      setLoading(false);
    };
    fetchIdols();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let result = allIdols;
    if (filters.name) {
      result = result.filter(idol => idol.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.prefecture) {
      result = result.filter(idol => idol.prefecture && idol.prefecture.toLowerCase().includes(filters.prefecture.toLowerCase()));
    }
    setFilteredIdols(result);
  }, [filters, allIdols]);

  if (loading) {
    return <Container sx={{ py: 4 }}><Typography>読み込み中...</Typography></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>アイドルを探す</Typography>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="ニックネームで検索" name="name" value={filters.name} onChange={handleFilterChange} size="small" />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="出身地で検索" name="prefecture" value={filters.prefecture} onChange={handleFilterChange} size="small" />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredIdols.length > 0 ? filteredIdols.map(idol => (
          <Grid item key={idol.id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={idol.photoURL || 'https://via.placeholder.com/200?text=No+Image'}
                alt={idol.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>{idol.name || '名前未設定'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {idol.prefecture || '出身地未設定'}
                </Typography>
                <Button 
                  size="small" 
                  sx={{ mt: 1 }} 
                  component={RouterLink} 
                  to={`/profile/${idol.id}`} // TODO: プロフィール詳細ページを作成
                >
                  プロフィールを見る
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Typography>条件に合うユーザーが見つかりませんでした。</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SearchPage;
