import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, LinearProgress, IconButton, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Delete as DeleteIcon, VideoLibrary as VideoLibraryIcon } from '@mui/icons-material';

const VideoManager = () => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 動画リストを取得
  useEffect(() => {
    if (!currentUser) return;
    const fetchVideos = async () => {
      const videosCollectionRef = collection(db, 'users', currentUser.uid, 'videos');
      const q = query(videosCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setVideos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchVideos();
  }, [currentUser]);

  // 動画アップロード処理
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const storageRef = ref(storage, `videos/${currentUser.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        setUploading(true);
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const videosCollectionRef = collection(db, 'users', currentUser.uid, 'videos');
          const newVideoData = {
            url: downloadURL,
            storagePath: uploadTask.snapshot.ref.fullPath,
            fileName: file.name,
            createdAt: serverTimestamp(),
          };
          const newVideoDoc = await addDoc(videosCollectionRef, newVideoData);
          setVideos(prev => [{ id: newVideoDoc.id, ...newVideoData }, ...prev]);
          setUploading(false);
        });
      }
    );
  };

  // 動画削除処理
  const handleDelete = async (video) => {
    if (!currentUser || !window.confirm(`${video.fileName}を削除しますか？`)) return;

    try {
      // Firestoreから削除
      await deleteDoc(doc(db, 'users', currentUser.uid, 'videos', video.id));
      // Storageから削除
      const videoRef = ref(storage, video.storagePath);
      await deleteObject(videoRef);
      
      setVideos(videos.filter(v => v.id !== video.id));
      alert('動画を削除しました。');
    } catch (error) {
      console.error("動画の削除に失敗しました:", error);
      alert('動画の削除に失敗しました。');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>動画管理</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>自己PR動画をアップロード</Typography>
        <Button variant="contained" component="label" disabled={uploading}>
          動画ファイルを選択
          <input type="file" hidden accept="video/*" onChange={handleUpload} />
        </Button>
        {uploading && <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />}
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>アップロード済み動画</Typography>
      <Grid container spacing={3}>
        {videos.length > 0 ? videos.map(video => (
          <Grid item key={video.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <video width="100%" height="150" controls src={video.url} style={{backgroundColor: '#000'}} />
                <Typography variant="body2" noWrap sx={{ mt: 1 }}>{video.fileName}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', pt: 1}}>
                  <IconButton onClick={() => handleDelete(video)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Typography>アップロードされた動画はありません。</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default VideoManager;
