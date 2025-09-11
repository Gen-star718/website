import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Paper, Button, CircularProgress, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

// 誕生日から年齢を計算するヘルパー関数
const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const birthday = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
};

const ProfileView = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfile(userDocSnap.data());
          const videosCollectionRef = collection(db, 'users', userId, 'videos');
          const q = query(videosCollectionRef, orderBy('createdAt', 'desc'));
          const videosSnapshot = await getDocs(q);
          setVideos(videosSnapshot.docs.map(doc => doc.data()));
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
      setLoading(false);
    };
    fetchProfileData();
  }, [userId]);

  const handleScout = async () => {
    if (!currentUser || currentUser.userType !== 'agency') return;

    const agencyId = currentUser.uid;
    const idolId = userId;
    const chatId = [agencyId, idolId].sort().join('_');
    
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        const idolDoc = await getDoc(doc(db, 'users', idolId));
        const idolData = idolDoc.data();

        await setDoc(chatRef, {
          participants: [agencyId, idolId],
          participantInfo: {
            [agencyId]: { name: currentUser.name, photoURL: currentUser.photoURL || '' },
            [idolId]: { name: idolData.name, photoURL: idolData.photoURL || '' }
          },
          createdAt: serverTimestamp(),
          lastMessage: { text: 'スカウトしました！チャットを開始しましょう！', createdAt: serverTimestamp(), senderId: agencyId },
        });
      }
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert("チャットの開始に失敗しました。");
    }
  };

  if (loading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  if (!profile) {
    return <Container sx={{ py: 4 }}><Typography variant="h5">ユーザーが見つかりません。</Typography></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', position: 'sticky', top: 20 }}>
            <Avatar src={profile.photoURL || ''} sx={{ width: 150, height: 150, margin: '0 auto 16px' }} />
            <Typography variant="h4" component="h1">{profile.name}</Typography>
            <Typography color="text.secondary" gutterBottom>
              {profile.prefecture || '出身地未設定'} / {calculateAge(profile.birthdate) ? `${calculateAge(profile.birthdate)}歳` : '年齢未設定'}
            </Typography>
            {currentUser?.userType === 'agency' && currentUser.uid !== userId && (
              <Button variant="contained" sx={{ mt: 3 }} onClick={handleScout}>スカウトする</Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>自己紹介</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{profile.bio || '自己紹介が登録されていません。'}</Typography>
            </CardContent>
          </Card>
          <Typography variant="h5" gutterBottom>自己PR動画</Typography>
          <Divider sx={{ mb: 2 }} />
          {videos.length > 0 ? videos.map((video, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <video width="100%" controls src={video.url} />
                <Typography variant="caption" color="text.secondary">{video.fileName}</Typography>
              </CardContent>
            </Card>
          )) : (
            <Typography>アップロードされた動画はありません。</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileView;