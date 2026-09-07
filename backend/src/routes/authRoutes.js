import { Router } from 'express';
import pool from '../services/postgresDb.js';
import { db } from '../services/db.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { 
      email, 
      password,
      role, 
      name, 
      dob, 
      hobbies, 
      state, 
      experience, 
      expertTradition 
    } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is mandatory for registration.' });
    }

    if (!role) {
      return res.status(400).json({ error: 'Role is required (LEARNER, PRACTITIONER, or AUTHORITY).' });
    }

    // Role-specific mandatory validation
    if (role === 'LEARNER') {
      if (!name?.trim()) return res.status(400).json({ error: 'Full Name is mandatory for Shishya.' });
      if (!dob) return res.status(400).json({ error: 'Date of Birth (DOB) is mandatory for Shishya.' });
      if (!hobbies?.trim()) return res.status(400).json({ error: 'Hobbies & Cultural Interests are mandatory for Shishya.' });
      if (!state) return res.status(400).json({ error: 'State selection is mandatory for Shishya.' });
    } else if (role === 'PRACTITIONER') {
      if (!name?.trim()) return res.status(400).json({ error: 'Full Name is mandatory for Guru.' });
      if (!state) return res.status(400).json({ error: 'State selection is mandatory for Guru.' });
      if (!dob) return res.status(400).json({ error: 'Date of Birth (DOB) is mandatory for Guru.' });
      if (!experience?.trim()) return res.status(400).json({ error: 'Experience is mandatory for Guru.' });
      if (!expertTradition?.trim()) return res.status(400).json({ error: 'Expert of which skills/tradition is mandatory for Guru.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const id = `user-${Date.now()}`;
    const newUserObj = {
      id,
      email: normalizedEmail,
      password: password || 'password123',
      role,
      name: name?.trim() || null,
      dob: dob || null,
      hobbies: hobbies?.trim() || null,
      state: state || null,
      experience: experience?.trim() || null,
      expertTradition: expertTradition?.trim() || null,
      profileCompleted: true,
      createdAt: new Date().toISOString()
    };

    let savedUser = newUserObj;

    // Save to PostgreSQL if available
    try {
      const query = `
        INSERT INTO users (id, email, password, role, name, dob, hobbies, state, experience, expert_tradition, profile_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          dob = EXCLUDED.dob,
          hobbies = EXCLUDED.hobbies,
          state = EXCLUDED.state,
          experience = EXCLUDED.experience,
          expert_tradition = EXCLUDED.expert_tradition,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `;
      const values = [
        id, normalizedEmail, password || 'password123', role, name?.trim() || null,
        dob || null, hobbies?.trim() || null, state || null, experience?.trim() || null,
        expertTradition?.trim() || null
      ];
      const result = await pool.query(query, values);
      if (result.rows.length > 0) {
        savedUser = result.rows[0];
      }
    } catch (pgErr) {
      console.warn('[Local Storage Fallback] Registering user in JSON database:', pgErr.message);
    }

    // Always mirror to local JSON db
    db.create('users', savedUser);

    return res.status(201).json({
      success: true,
      message: `${role === 'LEARNER' ? 'Shishya' : role === 'PRACTITIONER' ? 'Guru' : 'Admin'} registered successfully. You can now log in.`,
      user: savedUser
    });
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    return res.status(500).json({ error: 'Internal server error while registering user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required for login.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = null;

    // Try PostgreSQL users table
    try {
      let query = 'SELECT * FROM users WHERE LOWER(email) = $1';
      let params = [normalizedEmail];
      if (role) {
        query += ' AND role = $2';
        params.push(role);
      }
      const result = await pool.query(query, params);
      user = result.rows[0] || null;
    } catch (pgErr) {
      console.warn('[Local Storage Fallback] Querying login from JSON database:', pgErr.message);
    }

    // Fallback to JSON database
    if (!user) {
      const usersList = db.getCollection('users');
      user = usersList.find(u => 
        u.email?.toLowerCase() === normalizedEmail && 
        (!role || u.role === role)
      ) || null;
    }

    // Strict Enforcement: Account MUST exist in backend DB before logging in!
    if (!user) {
      if (role === 'LEARNER') {
        return res.status(401).json({
          success: false,
          error: 'Shishya account not found. You must register first with your mandatory Shishya details before you can log in!'
        });
      }
      if (role === 'PRACTITIONER') {
        return res.status(401).json({
          success: false,
          error: 'Guru account not found. You must register first with your mandatory Guru details before you can log in!'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Account not found. Please register first with your details before logging in.'
      });
    }

    // Password verification
    if (password && user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please verify your credentials.'
      });
    }

    const formattedUser = {
      ...user,
      profileCompleted: user.profileCompleted ?? user.profile_completed ?? true
    };

    return res.json({
      success: true,
      message: 'Login authenticated successfully',
      user: formattedUser
    });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      if (result.rows.length > 0) {
        return res.json({ success: true, count: result.rows.length, users: result.rows });
      }
    } catch (e) {}

    const users = db.getCollection('users');
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/auth/profile/:id
router.get('/profile/:id', async (req, res) => {
  try {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
      if (result.rows.length > 0) {
        return res.json({ success: true, user: result.rows[0] });
      }
    } catch (e) {}

    const user = db.getById('users', req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;
