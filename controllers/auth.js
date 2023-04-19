const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const fs = require("fs/promises");

const path = require("path");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const Jimp = require("jimp");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError.create(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const upgrateUser = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  const { email, subscription } = result;

  res.json({ user: { email, subscription } });
};

const updateAvatar = async (req, res) => {
  const { path: tmpUpload, filename } = req.file;
  const { _id } = req.user;
  const savename = `${_id}_${filename}`;
  const resultUpload = path.join(avatarDir, savename);

  await Jimp.read(tmpUpload)
    .then((image) => {
      return image.cover(250, 250).write(resultUpload);
    })
    .catch((err) => console.log(err));

  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", savename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  upgrateUser: ctrlWrapper(upgrateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
