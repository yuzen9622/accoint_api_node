const cron = require("node-cron");
const AccountModel = require("./Model/accountModel");
const RecordModel = require("./Model/recordModel");

cron.schedule("0 0 * * *", async () => {
  // 每天午夜執行
  console.log("🔄 處理自動記帳...");

  const now = new Date();

  // 查詢需要執行的定期支出 (nextRun 小於等於現在時間)
  const expenses = await RecurringExpense.find({
    nextRun: { $lte: now },
    status: "active",
  });

  for (const exp of expenses) {
    console.log(
      `📌 記錄支出 - 用戶: ${exp.userId}, 金額: ${exp.amount}, 類別: ${exp.category}`
    );

    // **確認是否已執行過**
    const existingExpense = await Expense.findOne({
      userId: exp.userId,
      category: exp.category,
      amount: exp.amount,
      date: {
        $gte: new Date(now.setHours(0, 0, 0, 0)), // 當天 00:00:00
        $lt: new Date(now.setHours(23, 59, 59, 999)), // 當天 23:59:59
      },
    });

    if (existingExpense) {
      console.log(`⚠️ 已經記錄過，跳過：${exp.category}`);
      continue; // 跳過這筆記錄
    }

    // 新增支出記錄
    await Expense.create({
      userId: exp.userId,
      category: exp.category,
      amount: exp.amount,
      date: new Date(), // 使用當前日期
    });

    // 計算下一次記錄時間
    let nextRun = new Date(exp.nextRun);
    if (exp.frequency === "daily") nextRun.setDate(nextRun.getDate() + 1);
    if (exp.frequency === "weekly") nextRun.setDate(nextRun.getDate() + 7);
    if (exp.frequency === "monthly") nextRun.setMonth(nextRun.getMonth() + 1);

    // 更新 nextRun，避免重複執行
    await RecurringExpense.updateOne({ _id: exp._id }, { nextRun });

    console.log(`✅ 記錄完成，下一次執行時間: ${nextRun}`);
  }
});
