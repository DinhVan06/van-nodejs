var express = require("express");
var router = express.Router();
const yup = require("yup");
const { validateSchema } = require("../schemas");
var passport = require("passport");
var jwt = require("jsonwebtoken");
const jwtSettings = require("../constants/jwtSettings");
const { findDocuments, findDocument } = require("../helpers/MongoDBHelpers");

// login chưa có validate
router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "admin" && password === "12345") {
    res.send({ message: "login thành công" });
    return;
  }
  res.status(400).send({ message: "login thất bại" });
});

const loginSchema = yup.object({
  body: yup.object({
    username: yup.string().email().required(),
    password: yup.string().required(),
  }),
  params: yup.object({}),
});

// login có validate
router.post(
  "/login-validate",
  validateSchema(loginSchema),
  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "admin@gmail.com" && password === "12345") {
      res.send({ message: "login thành công" });
      return;
    }
    res.status(400).send({ message: "login thất bại" });
  }
);

const getByIdSchema = yup.object({
  params: yup.object({
    id: yup.number().required(),
  }),
});
// root
router.get(
  "/users/:id",
  validateSchema(getByIdSchema),
  function (req, res, next) {
    res.send("ok");
  }
);

const findSchema = yup.object({
  query: yup.object({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
  }),
});
// querystring
router.get(
  "/users-find",
  validateSchema(findSchema),
  function (req, res, next) {
    res.send("ok");
  }
);

// ------------------------------------------------------------------------------------------------
// CALL API HTTP BASIC AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get(
  "/basic",
  passport.authenticate("basic", { session: false }),
  function (req, res, next) {
    res.json({ ok: true });
  }
);

const checkApiKey = () => {
  // return a middleware
  return (req, res, next) => {
    const apiKey = req.get("x-api-key");
    if (apiKey === "147258369") {
      next();
    } else {
      res.status(401).json({ message: "x-api-key is invalid" });
    }
  };
};

// Cách 1:
router.get("/api-key", checkApiKey(), function (req, res, next) {
  res.json({ ok: true });
});

// login jwt
router.post(
  "/login-jwt",
  validateSchema(loginSchema),
  async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const found = await findDocuments(
      {
        query: {
          username: username,
          password: password,
        },
      },
      "login"
    );

    if (found && found.length > 0) {
      const id = found[0]._id.toString();
      // cấp token
      var payload = {
        user: {
          username: username,
        },
        application: "ecommerce",
      };
      var secret = jwtSettings.SECRET;

      //acces token
      var token = jwt.sign(payload, secret, {
        expiresIn: 86400, // expires in 24 hours (24 x 60 x 60) thời gian hết hạn
        audience: jwtSettings.AUDIENCE,
        issuer: jwtSettings.ISSUER,
        subject: id, // Thường dùng để kiểm tra JWT lần sau
        algorithm: "HS512",
      });

      // refresh token
      const refreshToken = jwt.sign({ id }, secret, { expiresIn: "365d" });
      res.status(200).json({
        message: "login success",
        token: token,
        refreshToken,
      });
      return;
    }
    res.status(401).send({
      statusCode: 401,
      message: "login failed",
    });
  }
);

// refresh token
router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, jwtSettings.SECRET, async (err, decoded) => {
    if (err) {
      // return res.sendStatus(406);
      return res.sendStatus(401).json({ message: "refreshToken is invalid" });
    } else {
      const { id } = decoded;
      const user = await findDocument(id, "login");
      if (user && user.active) {
        const secret = jwtSettings.SECRET;

        const payload = {
          message: "payload",
        };

        const token = jwt.sign(payload, secret, {
          expiresIn: 24 * 60 * 60, // expires in 24 hours (24 x 60 x 60)
          audience: jwtSettings.AUDIENCE,
          issuer: jwtSettings.ISSUER,
          subject: id, // Thường dùng để kiểm tra JWT lần sau
          algorithm: "HS512",
        });

        return res.json({ token });
      }
      return res.sendStatus(401);
    }
  });
});
router.get(
  "/authentication",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("OK");
  }
);

// CHECK ROLES
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get("Authorization").replace("Bearer ", "");

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const { sub } = payload;

    // FING BY _id
    findDocument(sub, "login")
      .then((user) => {
        if (user && user.roles) {
          let ok = false;
          user.roles.forEach((role) => {
            if (roles.includes(role)) {
              ok = true;
              return;
            }
          });
          if (ok) {
            next();
          } else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
          }
        } else {
          response.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
      })
      .catch(() => {
        response.sendStatus(500);
      });
  };
};

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION & CHECK ROLES
// ------------------------------------------------------------------------------------------------
router.get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  allowRoles("managers", "administrators"),
  function (req, res, next) {
    res.json({ ok: true });
  }
);
module.exports = router;
