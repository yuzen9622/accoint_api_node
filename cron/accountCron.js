const AccountModel = require("../Model/accountModel");
const CategoryModel = require("../Model/categoryModel");
const RecordModel = require("../Model/recordModel");
const mongoose = require("mongoose");
module.exports = async function (req, res) {
  try {
    const uri = process.env.MONGOOSE_URI;
    await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("連接成功!");
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
          userId: account.userId,
          accountId: account.toAccountId,
          toAccountId: account._id,
          amount: Math.abs(account.amount),
          description: "自動扣款",
          source: "change",
          date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        });
        account.amount = 0;
        account.autoDebitRun = true;
        account.lastAutoDebitTime = now;
        await Promise.all([account.save(), record.save()]);
        console.log(
          `✅ 自動記帳成功: ${account._id} -> ${account.toAccountId}`
        );
      }
    }

    console.log("自動記帳處理完畢!");
    return res.json("結束自動記帳");
  } catch (error) {
    console.log(error);
  }
};
