const jwt = require("jsonwebtoken");

const isTokenExp = (exp) => {
  exp *= 1000;
  return Date.now() > exp - 3600 * 1000;
};

const createRefreshToken = (_id) => {
  const jwtKey = process.env.JWT_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};
const createUserToken = (_id) => {
  const jwtKey = process.env.TOKEN_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "24h" });
};
const validRefreshToken = (token) => {
  if (!token) return { ok: false, error: "no token" };
  const key = process.env.JWT_KEY;
  const valid = jwt.verify(token.split(" ")[1], key, (err, decoded) => {
    if (err) {
      return { ok: false, error: err.message };
    } else {
      if (isTokenExp(decoded.exp)) {
        const newToken = createUserToken(decoded._id);
        return { ok: true, _id: decoded._id, newToken };
      } else {
        return { ok: true, _id: decoded._id };
      }
    }
  });
  return valid;
};
const validUserToken = (token) => {
  if (!token) return { ok: false, error: "no token" };
  const key = process.env.TOKEN_KEY;
  const valid = jwt.verify(token.split(" ")[1], key, (err, decoded) => {
    if (err) {
      return { ok: false, error: err.message };
    } else {
      if (isTokenExp(decoded.exp)) {
        const newToken = createUserToken(decoded._id);
        return { ok: true, _id: decoded._id, newToken };
      } else {
        return { ok: true, _id: decoded._id };
      }
    }
  });
  return valid;
};

module.exports = {
  createRefreshToken,
  validRefreshToken,
  validUserToken,
  createUserToken,
};
