const RecordModel = require("../Model/recordModel");
const AccountModel = require("../Model/accountModel");
const { validUserToken } = require("../jwt");

const addRecord = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const valid = validUserToken(token);
    const {
      _id,
      userId,
      categoryId,
      accountId,
      amount,
      description,
      date,
      source,
      toAccountId,
    } = req.body;

    if (valid.ok) {
      if (
        !userId ||
        !categoryId ||
        !accountId ||
        amount === null ||
        amount === "" ||
        !date ||
        !source
      ) {
        return res.status(400).json({ error: "請確認必填欄位都有資料" });
      }

      if (_id && source !== "change") {
        const record = await RecordModel.findById({ _id });
        const oldAccount = await AccountModel.findById({
          _id: record.accountId,
        });
        const newAccount = await AccountModel.findById({ _id: accountId });
        if (source === "income") {
          oldAccount.amount -= parseFloat(record.amount);
          await oldAccount.save();
          newAccount.amount = oldAccount.amount + parseFloat(amount);
        } else {
          oldAccount.amount += parseFloat(record.amount);
          await oldAccount.save();
          newAccount.amount = oldAccount.amount - parseFloat(amount);
        }
        console.log(oldAccount.amount, newAccount.amount);
        await newAccount.save();
        await record.updateOne({
          userId,
          categoryId,
          accountId,
          amount,
          description,
          date,
          toAccountId: null,
          source,
        });
        return res.status(200).json({ ok: valid.ok, message: "修改成功" });
      }

      if (_id && source === "change") {
        if (!toAccountId)
          return res.status(400).json({ error: "請確認必填欄位都有資料" });
        const record = await RecordModel.findById({ _id });
        const oldAccount = await AccountModel.findById({
          _id: record.accountId,
        });

        if (record.source === "income") {
          oldAccount.amount -= parseFloat(record.amount);
        } else {
          oldAccount.amount += parseFloat(record.amount);
        }
        if (record.toAccountId !== "") {
          const oldToAccount = await AccountModel.findById({
            _id: record.toAccountId,
          });
          oldToAccount.amount -= parseFloat(record.amount);
          await oldToAccount.save();
        }

        await oldAccount.save();

        const newAccount = await AccountModel.findById({ _id: accountId });

        const newToAccount = await AccountModel.findById({ _id: toAccountId });
        newAccount.amount -= parseFloat(amount);
        newToAccount.amount += parseFloat(amount);
        await newAccount.save();
        await newToAccount.save();
        await record.updateOne({
          userId,
          categoryId,
          accountId,
          amount,
          description,
          date,
          toAccountId,
          source,
        });
        return res.status(200).json({ ok: valid.ok, message: "修改成功" });
      }

      const record = new RecordModel({
        userId,
        categoryId,
        accountId,
        amount,
        description,
        source,
        toAccountId,
        date,
      });

      await record.save();
      if (record) {
        const account = await AccountModel.findById({ _id: accountId });
        if (source === "income") {
          account.amount = account.amount + parseFloat(amount);
        } else {
          account.amount = parseFloat(account.amount) - parseFloat(amount);
          if (source === "change") {
            const toAccount = await AccountModel.findById({ _id: toAccountId });
            toAccount.amount = toAccount.amount + parseFloat(amount);
            await toAccount.save();
          }
        }
        await account.save();

        return res.status(200).json({
          ok: valid.ok,
          record,
          newToken: valid?.newToken,
          message: "新增成功",
        });
      } else {
        return res.status(200).json({ error: "新增失敗" });
      }
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, error });
  }
};

const getRecord = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    const { year, month, date, start, end } = req.query;

    if (valid.ok) {
      const userId = valid._id;
      let records;
      if (year && month) {
        records = await RecordModel.find({
          userId,
          $expr: {
            $and: [
              { $eq: [{ $year: "$date" }, year] },
              { $eq: [{ $month: "$date" }, month] },
            ],
          },
        }).sort({ createdAt: 1 });
      } else if (year) {
        records = await RecordModel.find({
          userId,
          $expr: {
            $and: [{ $eq: [{ $year: "$date" }, year] }],
          },
        }).sort({ createdAt: 1 });
      } else if (date) {
        const startDate = new Date(date.split(" ")[0] + "T00:00:00"); // 例如 '2025-01-14T00:00:00'
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        records = await RecordModel.find({
          userId,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        }).sort({ createdAt: 1 });
      } else if (start && end) {
        console.log(new Date(end).toISOString());
        records = await RecordModel.find({
          userId,
          date: {
            $gte: new Date(start).toISOString(),
            $lte: end,
          },
        }).sort({ createdAt: 1 });
      } else {
        records = await RecordModel.find({ userId }).sort({ createdAt: 1 });
      }
      return res
        .status(200)
        .json({ ok: valid.ok, records, newToken: valid?.newToken });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, error });
  }
};
const deleteRecord = async (req, res) => {
  const { recordId } = req.params;
  const token = req.headers.authorization;
  const valid = validUserToken(token);
  try {
    if (!recordId) return res.status(400).json({ error: "no id" });
    if (valid.ok) {
      let record = await RecordModel.findByIdAndDelete({
        _id: recordId,
      });

      const account = await AccountModel.findById({ _id: record.accountId });
      if (record.source === "income") {
        account.amount -= parseFloat(record.amount);
      } else {
        account.amount += parseFloat(record.amount);
      }
      if (record.source === "change") {
        const toAccount = await AccountModel.findById({
          _id: record.toAccountId,
        });
        toAccount.amount -= parseFloat(record.amount);
        await toAccount.save();
      }

      await account.save();

      return res.status(200).json({ ok: valid.ok });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addRecord, getRecord, deleteRecord };
