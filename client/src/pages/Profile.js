import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { apiRequest, logout } from '../api/api';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiRequest('/me');
        if (!mounted) return;
        setUser(res.user);
        setFullName(res.user?.full_name || '');
        setGoal(res.user?.goal || '');
      } catch (err) {
        console.error('Failed to load profile', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await apiRequest('/me', 'PATCH', { fullName, goal });
      setUser(res.user);
    } catch (err) {
      console.error('Failed to save profile', err.message);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72 }}>A</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Profile</Typography>
            <Typography variant="body2" color="text.secondary">Account details</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextField label="Email" value={user.email || ''} disabled />

          <TextField label="Career / Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <TextField label="Gender" value={user.gender || ''} disabled />

          <TextField label="Experience level" value={user.experience_level || ''} disabled />
          <TextField label="Member since" value={new Date(user.created_at).toLocaleDateString()} disabled />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button variant="outlined" color="error" onClick={() => { logout(); window.location.reload(); }}>Logout</Button>
        </Box>
      </Paper>
    </Box>
  );
}
