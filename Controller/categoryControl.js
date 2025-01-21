const CategoryModel = require("../Model/categoryModel");
const { validUserToken } = require("../jwt");

const getCategory = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const valid = validUserToken(token);
    if (valid.ok) {
      const userId = valid._id;
      const categories = await CategoryModel.find({
        $or: [{ userId, userId: null }],
      });

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
    const { userId, type, source } = req.body;
    const valid = validUserToken(token);
    if (valid.ok) {
      let category = await CategoryModel.findOne({
        userId,
        categoriesType: type,
      });
      if (category) return res.status(400).json({ error: "類別已存在" });

      category = new CategoryModel({
        userId,
        categoriesType: type,
      });
      await category.save();
      return res
        .status(200)
        .json({ ok: valid.ok, category, newToken: valid?.newToken });
    } else {
      return res.status(400).json({ ok: valid.ok, error: valid.error });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
module.exports = { getCategory, addCategory };
