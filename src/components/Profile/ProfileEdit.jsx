import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, Avatar, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    birthdate: '',
    height: '',
    prefecture: '',
    photoURL: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setError('');
    setSuccess('');

    try {
      let photoURL = profile.photoURL;
      // 画像が新しく選択された場合、Storageにアップロード
      if (imageFile) {
        const imageRef = ref(storage, `profile_images/${currentUser.uid}/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      const updatedProfile = { ...profile, photoURL };

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile, { merge: true });
      setProfile(updatedProfile); // stateを更新して表示に反映
      setSuccess('プロフィールを更新しました！');

    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
      setError('プロフィールの更新に失敗しました。');
    }
  };

  if (loading) {
    return <Container sx={{ py: 4 }}><Typography>読み込み中...</Typography></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>プロフィール編集</Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar src={profile.photoURL || ''} sx={{ width: 120, height: 120, mb: 2 }} />
                <Button variant="outlined" component="label">
                  プロフィール写真を選択
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="ニックネーム" name="name" value={profile.name} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="誕生日" name="birthdate" type="date" value={profile.birthdate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="身長 (cm)" name="height" type="number" value={profile.height} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="出身地（都道府県）" name="prefecture" value={profile.prefecture} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={4} label="自己紹介" name="bio" value={profile.bio} onChange={handleChange} /></Grid>
              <Grid item xs={12}><Button type="submit" variant="contained" size="large">プロフィールを保存</Button></Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileEdit;
