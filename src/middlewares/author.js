import { User } from '../modules/users/user.model.js';

export const authorizeAdmin = async (req, res, next) => {
  const doc = await User.findById(req.user.users._id);
  if (doc.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
