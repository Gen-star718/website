import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const ChatRoom = () => {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // メッセージをリアルタイムで取得
  useEffect(() => {
    const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollectionRef, orderBy('createdAt'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // メッセージ送信処理
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCollectionRef, {
      text: newMessage,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    // 親ドキュメントのlastMessageを更新
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        text: newMessage,
        createdAt: serverTimestamp(),
        senderId: currentUser.uid,
      }
    });

    setNewMessage('');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">チャット</Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f4f6f8' }}>
          {messages.map(msg => (
            <Box 
              key={msg.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper 
                variant="elevation"
                elevation={1}
                sx={{ 
                  p: 1.5, 
                  bgcolor: msg.senderId === currentUser.uid ? 'primary.light' : 'white',
                  color: msg.senderId === currentUser.uid ? 'primary.contrastText' : 'text.primary',
                  borderRadius: msg.senderId === currentUser.uid ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 1, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            size="small"
            placeholder="メッセージを入力..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            autoComplete="off"
          />
          <IconButton type="submit" color="primary" sx={{ ml: 1 }} disabled={!newMessage.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatRoom;