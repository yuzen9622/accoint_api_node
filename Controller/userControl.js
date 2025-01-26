const UserModel = require("../Model/userModel");
const CategoryModel = require("../Model/categoryModel");
const AccountModel = require("../Model/accountModel");
const bcrypt = require("bcryptjs");
const {
  createRefreshToken,
  validRefreshToken,
  createUserToken,
} = require("../jwt");

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
      { categoriesType: "美容美髮", userId: _id, source: "expense" },
      { categoriesType: "交計應酬", userId: _id, source: "expense" },
      { categoriesType: "學習深造", userId: _id, source: "expense" },
      { categoriesType: "保險", userId: _id, source: "expense" },
      { categoriesType: "稅金", userId: _id, source: "expense" },
      { categoriesType: "醫療", userId: _id, source: "expense" },
      { categoriesType: "教育", userId: _id, source: "expense" },
      { categoriesType: "校正回歸", userId: _id, source: "expense" },
      { categoriesType: "轉帳手續費", userId: _id, source: "expense" },
      { categoriesType: "工資", userId: _id, source: "income" },
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
    const setting = await registerSetting(user._id);
    const token = createRefreshToken(user._id);
    if (!setting) return res.status(500).json({ error: "設定失敗" });
    return res.status(200).json({
      _id: user._id,
      name: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
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

module.exports = { loginUser, registerUser, getToken, registerSetting };
