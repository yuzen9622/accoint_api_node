const { query } = require("express");
const RecordModel = require("../Model/recordModel");
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
      if (_id) {
        await RecordModel.updateOne(
          { _id },
          { categoryId, accountId, amount, description, source, date }
        );
        return res.status(200).json({ ok: valid.ok });
      }

      const record = new RecordModel({
        userId,
        categoryId,
        accountId,
        amount,
        description,
        source,
        date,
      });

      await record.save();
      if (record) {
        return res
          .status(200)
          .json({ ok: valid.ok, record, newToken: valid?.newToken });
      } else {
        return res.status(200).json({ error: "新增失敗" });
      }
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
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
        records = await RecordModel.find({
          userId,
          date: {
            $gte: start,
            $lt: end,
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
      let record = await RecordModel.deleteOne({ _id: recordId });

      return res.status(200).json({ ok: valid.ok });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addRecord, getRecord, deleteRecord };
