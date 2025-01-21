const UserModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createRefreshToken,
  validRefreshToken,
  createUserToken,
} = require("../jwt");
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "電子郵件不正確" });
    let Validpassword = await bcrypt.compare(password, user.password);
    if (!Validpassword) return res.status(400).json({ error: "密碼不正確" });
    const token = createRefreshToken(user._id);
    if (user && Validpassword) {
      return res.status(200).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) return res.status(401).json({ error: "電子郵件已被使用" });
    user = new UserModel({
      username: name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = createRefreshToken(user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const getToken = async (req, res) => {
  const token = req.headers.authorization;

  const valid = validRefreshToken(token);

  if (valid.ok) {
    const userToken = createUserToken(valid._id);
    let refreshToken = createRefreshToken(valid._id);

    return res.status(200).json({ token: userToken, refreshToken });
  } else {
    return res
      .status(400)
      .json({ ok: false, error: "token 錯誤:" + valid.error });
  }
};

module.exports = { loginUser, registerUser, getToken };
