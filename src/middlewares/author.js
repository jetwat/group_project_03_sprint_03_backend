import { User } from '../modules/users/user.model';

export const authorizeAdmin = async (req, res, next) => {
  const role = await User.findById(req.user.users._id);
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
