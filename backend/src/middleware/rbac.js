/**
 * Role-Based Access Control (RBAC) Middleware for Sanskriti Suraksha Backend API
 * 
 * Enforces role-based permissions on API endpoints based on user role headers / session context.
 * Roles:
 *  - LEARNER (Shishya)
 *  - PRACTITIONER (Guru)
 *  - AUTHORITY (Admin)
 */

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // Extract user role from header or body
      const userRole = req.headers['x-user-role'] || req.headers['role'] || req.body?.userRole || req.query?.userRole || 'GUEST';
      
      // AUTHORITY has full administrative access to all routes
      if (userRole === 'AUTHORITY') {
        return next();
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: `Forbidden: Role '${userRole}' is not authorized to access this resource. Required role(s): ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (err) {
      console.error('Error in RBAC middleware:', err);
      return res.status(500).json({ error: 'Internal server error during authorization check' });
    }
  };
}
