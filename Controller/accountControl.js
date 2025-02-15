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
    const { userId, accountsType, initialAmount, autoDebit, autoDebitDay } =
      req.body;

    if (valid.ok) {
      if (valid._id !== userId)
        return res.status(400).json({ error: "Id錯誤 請重新登入" });

      if (accountsType === "" || initialAmount === "")
        return res.status(400).json({ error: "請輸入必填欄位" });
      const accounts = await AccountModel.findOne({
        userId: userId,
        accountsType,
      });
      if (accounts) return res.status(400).json({ error: "帳戶已存在" });
      let account = new AccountModel({
        userId: userId,
        accountsType,
        initialAmount: initialAmount || 0,
        amount: initialAmount,
        autoDebit,
        autoDebitDay,
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
      const changeRecord = await RecordModel.find({
        $or: [{ accountId: _id }, { toAccountId: _id }],
      });
      changeRecord.forEach((item) => {});
      await RecordModel.deleteMany({
        $or: [{ accountId: _id }, { toAccountId: _id }],
      });
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
    const {
      _id,
      userId,
      accountsType,
      initialAmount,
      autoDebit,
      autoDebitDay,
      toAccountId,
    } = req.body;
    if (accountsType === "" || initialAmount === "")
      return res.status(400).json({ error: "請輸入必填欄位" });
    if (valid.ok) {
      let oldAccount = await AccountModel.findOne({
        _id,
      });

      if (!oldAccount) {
        return res.status(400).json({ error: "帳戶不存在" });
      }
      const account = await AccountModel.findById({ _id });
      let amount = parseFloat(initialAmount) - account.initialAmount;
      account.amount += amount;
      account.initialAmount = parseFloat(initialAmount);
      account.accountsType = accountsType;
      if (
        autoDebit &&
        (!toAccountId ||
          !autoDebitDay ||
          toAccountId === "" ||
          autoDebitDay === "")
      ) {
        return res.status(400).json({ error: "請輸入必填欄位" });
      }

      account.autoDebit = autoDebit;
      account.autoDebitDay = autoDebitDay;
      account.toAccountId = toAccountId;
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
