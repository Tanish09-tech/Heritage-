import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sanskriti_suraksha_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for an authenticated user
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Middleware to verify JWT token in incoming requests
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-access-token'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication token is required to access this resource.'
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.warn('[JWT Auth Warning] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token. Please log in again.'
    });
  }
}

/**
 * Optional token middleware: parses token if present, but does not block if missing
 */
export function optionalToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-access-token'];
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Ignore token parse failure for optional auth
    }
  }
  next();
}
