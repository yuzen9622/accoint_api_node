const CategoryModel = require("../Model/categoryModel");
const { validUserToken } = require("../config/jwt");

const getCategory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const userId = valid._id;
      const categories = await CategoryModel.find({ userId });
      return res
        .status(200)
        .json({ ok: valid.ok, categories, newToken: valid?.newToken });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addCategory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { userId, categoriesType, source } = req.body;
    const valid = validUserToken(token);

    if (!userId || !categoriesType || !source)
      return res.status(400).json({ error: "請輸入必填選項選項" });
    if (valid.ok) {
      if (valid._id !== userId)
        return res.status(400).json({ error: "Id錯誤 請重新登入" });
      const category = await CategoryModel.findOne({
        userId,
        categoriesType,
      });
      if (category) {
        if (category.isDeleted) {
          category.isDeleted = false;
          await category.save();
          return res
            .status(200)
            .json({ ok: valid.ok, category, newToken: valid?.newToken });
        } else {
          return res.status(400).json({ ok: valid.ok, error: "類別已存在" });
        }
      }

      const newCategory = new CategoryModel({
        userId,
        categoriesType,
        source,
      });
      await newCategory.save();
      return res.status(200).json({
        ok: valid.ok,
        category: newCategory,
        newToken: valid?.newToken,
      });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { _id } = req.params;
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const category = await CategoryModel.findById({ _id });
      category.isDeleted = true;
      await category.save();
      return res.status(200).json({ ok: valid.ok, message: "刪除成功" });
    } else {
      return res.status(400).json({ ok: valid.ok, error: "憑證錯誤" });
    }
  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { _id, categoriesType, source } = req.body;
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const category = await CategoryModel.findById({ _id });
      category.categoriesType = categoriesType;
      category.source = source;
      await category.save();
      if (category) {
        return res.status(200).json({ ok: valid.ok, category });
      } else {
        return res.status(400).json({ ok: false, error: "類別不存在" });
      }
    } else {
      return res.status(400).json({ ok: valid.ok, error: "憑證錯誤" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error" });
  }
};

module.exports = { getCategory, addCategory, deleteCategory, updateCategory };
