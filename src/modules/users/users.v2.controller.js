import { User } from './user.model.js';

const userResponse = (doc) => {
  const user = doc.toObject();

  delete user.password;

  if (user.card) {
    delete user.card.cvv;
  }

  return user;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MAX = 72;

export const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, role, fullName } = req.body || {};

  const trimmedUsername = String(username || '').trim();
  const trimmedEmail = String(email || '')
    .trim()
    .toLowerCase();

  if (!trimmedUsername || !trimmedEmail || !password) {
    const err = new Error('username, email, and password are required');
    err.name = 'ValidationError';
    err.status = 400;
    return next(err);
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    const err = new Error('Invalid email format');
    err.name = 'ValidationError';
    err.status = 400;
    return next(err);
  }

  if (password.length > PASSWORD_MAX) {
    const err = new Error(
      `password must not exceed ${PASSWORD_MAX} characters`
    );
    err.name = 'ValidationError';
    err.status = 400;
    return next(err);
  }
  try {
    const doc = await User.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
      fullName,
      ...(role ? { role } : {})
    });

    return res.status(201).json({
      success: true,
      data: userResponse(doc)
    });
  } catch (err) {
    if (err.code === 11000) {
      err.status = 409;
      err.name = 'DuplicateKeyError';
      err.message = 'Email already in use';
      return next(err);
    }
    err.status = 500;
    err.name = err.name || 'DatabaseError';
    err.message = err.message || 'Failed to create user';
    return next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email, password, role } = req.body || {};
  const updates = {};

  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password = password;
  if (role !== undefined) updates.role = role;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one field is required to update'
    });
  }

  try {
    const doc = await User.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!doc) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

//For setting page
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.users._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: userResponse(user)
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.users._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (req.body.username !== undefined) {
      user.username = req.body.username;
    }

    if (req.body.email !== undefined) {
      user.email = req.body.email;
    }

    if (req.body.password !== undefined) {
      user.password = req.body.password;
    }

    if (req.body.fullName !== undefined) {
      user.fullName = req.body.fullName;
    }

    if (req.body.phone !== undefined) {
      user.phone = req.body.phone;
    }

    if (req.body.dateOfBirth !== undefined) {
      user.dateOfBirth = req.body.dateOfBirth;
    }

    if (req.body.address !== undefined) {
      user.address = req.body.address;
    }

    if (req.body.card !== undefined) {
      user.card = req.body.card;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      data: userResponse(user)
    });
  } catch (err) {
    next(err);
  }
};
