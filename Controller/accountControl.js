const AccountModel = require("../Model/accountModel");
const RecordModel = require("../Model/recordModel");
const { validUserToken } = require("../jwt");

const getAccount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);

    if (valid.ok) {
      const userId = valid._id;
      const accounts = await AccountModel.find({
        $or: [{ userId }, { userId: null }],
      });

      return res
        .status(200)
        .json({ ok: valid.ok, accounts, newToken: valid?.newToken });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addAccount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    const { userId, type, amount } = req.body;

    if (valid.ok) {
      const accounts = await AccountModel.findOne({
        userId: userId,
        accountsType: type,
      });
      if (accounts) return res.status(400).json({ error: "類別已存在" });
      let account = new AccountModel({
        userId: userId,
        accountsType: type,
        amount: amount || 0,
      });
      await account.save();

      return res
        .status(200)
        .json({ ok: valid.ok, account, newToken: valid?.newToken });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    const { _id } = req.params;
    if (!_id) return res.status(400).json({ error: "請提供id" });
    if (valid.ok) {
      await RecordModel.deleteMany({ accountId: _id });
      const account = await AccountModel.findByIdAndDelete({ _id });
      if (account) return res.status(200).json({ ok: valid.ok });
    } else {
      return res.status(400).json({ ok: valid.ok, error: "憑證錯誤" });
    }
  } catch (error) {
    return res.status(500).json({ error: "伺服器錯誤" });
  }
};

const updateAccount = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    const { _id, amount, type } = req.body;
    if (!amount || !type)
      return res.status(400).json({ error: "請輸入必填欄位" });
    if (valid.ok) {
      let oldAccount = await AccountModel.findOne({ accountsType: type });

      if (oldAccount && oldAccount?._id.toString() !== _id) {
        return res.status(400).json({ error: "名稱已被使用" });
      }
      const account = await AccountModel.findById({ _id });
      account.initalAmount = parseFloat(amount);
      await account.save();
      return res.status(200).json({ ok: valid.ok, account });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAccount, addAccount, updateAccount, deleteAccount };
