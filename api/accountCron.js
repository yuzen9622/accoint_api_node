const AccountModel = require("../Model/accountModel");
const RecordModel = require("../Model/recordModel");

module.exports = async function (req, res) {
  console.log("🔄 處理自動記帳...");
  const now = new Date();
  const autoDebitAccount = await AccountModel.find({
    autoDebit: true,
  });
  if (autoDebitAccount.length === 0) return res.json("結束自動記帳");

  for (let account of autoDebitAccount) {
    if (account.autoDebitRun) {
      if (account.autoDebitDay < now.getDate()) {
        account.autoDebitRun = false;
        await account.save();
      }
    }
    if (account.autoDebitDay === now.getDate() && account.amount < 0) {
      const record = new RecordModel({
        accountId: account.toAccountId,
        toAccountId: account._id,
        amount: Math.abs(account.amount),
        source: "change",
      });
      account.amount = 0;
      account.autoDebitRun = true;
      account.lastAutoDebitTime = now;
      await Promise.all([account.save(), record.save()]);
      console.log(`✅ 自動記帳成功: ${account._id} -> ${account.toAccountId}`);
    }
  }
};
