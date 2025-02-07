const UserModel = require("../Model/userModel");
const CategoryModel = require("../Model/categoryModel");
const AccountModel = require("../Model/accountModel");
const bcrypt = require("bcryptjs");
const {
  createRefreshToken,
  validRefreshToken,
  createUserToken,
  validUserToken,
} = require("../jwt");
const RecordModel = require("../Model/recordModel");

const registerSetting = async (_id) => {
  try {
    if (!_id) return;
    const categories = [
      { categoriesType: "飲食", userId: _id, source: "expense" },
      { categoriesType: "日常用品", userId: _id, source: "expense" },
      { categoriesType: "交通", userId: _id, source: "expense" },
      { categoriesType: "水電瓦斯", userId: _id, source: "expense" },
      { categoriesType: "電話網路", userId: _id, source: "expense" },
      { categoriesType: "居家", userId: _id, source: "expense" },
      { categoriesType: "服飾", userId: _id, source: "expense" },
      { categoriesType: "汽車", userId: _id, source: "expense" },
      { categoriesType: "娛樂", userId: _id, source: "expense" },
      { categoriesType: "罰款", userId: _id, source: "expense" },
      { categoriesType: "美容美髮", userId: _id, source: "expense" },
      { categoriesType: "交際應酬", userId: _id, source: "expense" },
      { categoriesType: "學習深造", userId: _id, source: "expense" },
      { categoriesType: "保險", userId: _id, source: "expense" },
      { categoriesType: "稅金", userId: _id, source: "expense" },
      { categoriesType: "醫療", userId: _id, source: "expense" },
      { categoriesType: "教育", userId: _id, source: "expense" },
      { categoriesType: "校正回歸", userId: _id, source: "expense" },
      { categoriesType: "轉帳手續費", userId: _id, source: "expense" },
      { categoriesType: "新資", userId: _id, source: "income" },
      { categoriesType: "獎金", userId: _id, source: "income" },
      { categoriesType: "投資", userId: _id, source: "income" },
      { categoriesType: "副業", userId: _id, source: "income" },
      { categoriesType: "借貸", userId: _id, source: "income" },
      { categoriesType: "較正回歸", userId: _id, source: "income" },
      { categoriesType: "領錢", userId: _id, source: "change" },
      { categoriesType: "存款", userId: _id, source: "change" },
    ];
    const accounts = [
      { accountsType: "現金", userId: _id },
      { accountsType: "銀行", userId: _id },
      { accountsType: "信用卡", userId: _id },
      { accountsType: "悠遊卡", userId: _id },
      { accountsType: "行動支付", userId: _id },
    ];
    await CategoryModel.insertMany(categories);
    await AccountModel.insertMany(accounts);
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "帳號或密碼錯誤" });
    }
    let Validpassword = await bcrypt.compare(password, user.password);
    if (!Validpassword) {
      return res.status(400).json({ error: "帳號或密碼錯誤" });
    }

    const token = createRefreshToken(user._id);
    if (user && Validpassword) {
      return res.status(200).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        theme: user.theme,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "請輸入必填欄位!" });
    let user = await UserModel.findOne({ email: email });
    if (user) return res.status(400).json({ error: "電子郵件已被使用!" });
    const newUser = new UserModel({
      username: name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    const setting = await registerSetting(newUser._id);
    const token = createRefreshToken(newUser._id);
    if (!setting) return res.status(500).json({ error: "設定失敗!" });
    return res.status(200).json({
      _id: newUser._id,
      name: newUser.username,
      email: newUser.email,

      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};

const updateUser = async (req, res) => {
  const { _id, name, email, password } = req.body;
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const user = await UserModel.findById({ _id });
      user.username = name;
      user.email = email;

      if (password !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      await user.save();
      const token = createRefreshToken(user._id);
      return res.status(200).json({
        ok: valid.ok,
        user: {
          _id: user._id,
          name: user.username,
          email: user.email,
          token,
        },
      });
    } else {
      return res.status(400).json({ ok: valid.ok, error: "憑證錯誤" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};
const updateTheme = async (req, res) => {
  const theme = req.body;
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const user = await UserModel.findById({ _id: valid._id });
      user.theme = theme;
      await user.save();
      return res.status(200).json({ ok: valid.ok });
    }
  } catch (error) {
    return res.status(500).json({ error: "伺服器錯誤" });
    s;
  }
};
const destoryUser = async (req, res) => {
  const { _id } = req.body;

  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok && valid._id === _id) {
      const deleteUser = await UserModel.findByIdAndDelete({ _id });
      if (deleteUser) {
        await AccountModel.deleteMany({ userId: _id });
        await RecordModel.deleteMany({ userId: _id });
        await CategoryModel.deleteMany({ userId: _id });
        return res.status(200).json({ ok: valid.ok, message: "刪除成功" });
      }
    }
  } catch (error) {}
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

module.exports = {
  loginUser,
  registerUser,
  getToken,
  registerSetting,
  updateUser,
  destoryUser,
  updateTheme,
};
