const AccountModel = require("../Model/accountModel");
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
    const { userId, type } = req.body;

    if (valid.ok) {
      const accounts = await AccountModel.findOne({
        userId: userId,
        accountsType: type,
      });
      if (accounts) return res.status(400).json({ error: "類別已存在" });
      let account = new AccountModel({
        userId: userId,
        accountsType: type,
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

module.exports = { getAccount, addAccount };
