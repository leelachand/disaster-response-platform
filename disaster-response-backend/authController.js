// controllers/authController.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Register user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm', // optional
      },
    });

    if (error) {
      console.error('Registration error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to confirm your account.',
      data,
    });
  } catch (err) {
    console.error('Unexpected registration error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login error:', error.message);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    console.error('Unexpected login error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
