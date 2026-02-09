import { useEffect, useState, useRef } from "react";
import { apiRequest } from "../api/api";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Home() {
  const [sessions, setSessions] = useState([
    { id: 'session-1', title: 'New chat' },
  ]);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [activeSession, setActiveSession] = useState(sessions[0].id);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { scrollToBottom(); }, [messages]);
  function scrollToBottom() { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }

  async function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiRequest('/advice', 'POST', { category: 'career', question: text });
      const aiText = res.record?.ai_output || 'No response';
      setMessages((m) => [...m, { role: 'assistant', text: aiText }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: err.message }]);
    } finally { setLoading(false); }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
            <Box>
              <Typography variant="subtitle1">Your Chats</Typography>
              <Typography variant="caption" color="text.secondary">Quick access</Typography>
            </Box>
          </Box>

          <List>
            {sessions.map((s) => (
              <ListItem key={s.id} button selected={s.id === activeSession} onClick={() => setActiveSession(s.id)}>
                {editingSessionId === s.id ? (
                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Enter topic..."
                    value={s.title}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSessions((old) => old.map(x => x.id === s.id ? { ...x, title: v } : x));
                    }}
                    onBlur={() => {
                      // commit on blur
                      setEditingSessionId(null);
                      setSessions((old) => old.map(x => x.id === s.id ? { ...x, title: x.title.trim() || 'New chat' } : x));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        setEditingSessionId(null);
                        setSessions((old) => old.map(x => x.id === s.id ? { ...x, title: x.title.trim() || 'New chat' } : x));
                      }
                    }}
                    sx={{ width: '100%' }}
                  />
                ) : (
                  <ListItemText primary={s.title} />
                )}
              </ListItem>
            ))}
          </List>

          {/* When editing a new session, hide the New chat button and show topic input inline */}
          {!editingSessionId && (
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => {
              const id = `session-${Date.now()}`;
              setSessions((old) => {
                const next = [...old, { id, title: '' }];
                return next;
              });
              setActiveSession(id);
              setEditingSessionId(id);
            }}>+ New chat</Button>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={8} lg={9}>
        <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{sessions.find(s => s.id === activeSession)?.title || 'Chat'}</Typography>

          <Box sx={{ flex: 1, overflow: 'auto', mb: 1 }}>
            {messages.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Box sx={{ maxWidth: '80%' }}>
                  <Paper sx={{ p: 1.25, bgcolor: m.role === 'user' ? 'primary.main' : '#f5f5f7', color: m.role === 'user' ? 'white' : 'text.primary' }}>
                    {m.text}
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <TextField fullWidth multiline minRows={2} placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button variant="contained" onClick={send} disabled={loading}>{loading ? 'Thinking...' : 'Send'}</Button>
              <Button variant="outlined" onClick={() => setInput('')}>Clear</Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
