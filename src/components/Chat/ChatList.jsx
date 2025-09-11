import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ja';

const ChatList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const chatsCollectionRef = collection(db, 'chats');
    const q = query(
      chatsCollectionRef, 
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessage.createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatRooms = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const otherParticipantId = data.participants.find(p => p !== currentUser.uid);
        const otherParticipantInfo = data.participantInfo[otherParticipantId];
        return {
          id: doc.id,
          ...data,
          otherUser: otherParticipantInfo,
        };
      });
      setChats(chatRooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return moment(timestamp.toDate()).fromNow();
  };

  if (loading) {
    return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>メッセージ</Typography>
      <Paper>
        <List sx={{padding: 0}}>
          {chats.length > 0 ? chats.map((chat, index) => (
            <ListItem 
              key={chat.id} 
              button 
              onClick={() => handleChatClick(chat.id)}
              divider={index < chats.length - 1}
            >
              <ListItemAvatar>
                <Avatar src={chat.otherUser?.photoURL || ''} />
              </ListItemAvatar>
              <ListItemText
                primary={chat.otherUser?.name || '不明なユーザー'}
                secondary={chat.lastMessage?.text || 'まだメッセージはありません'}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(chat.lastMessage?.createdAt)}
              </Typography>
            </ListItem>
          )) : (
            <ListItem>
              <ListItemText primary="進行中のチャットはありません。" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ChatList;
