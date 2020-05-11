const express = require("express");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const DangerRecordController = require("./app/controllers/DangerRecordController");

const middleware = require("./app/middleware/auth");

const routes = express.Router();

routes.post("/sessions", SessionController.store);

routes.post("/users", UserController.store);

routes.use(middleware);

routes.get("/dangers", DangerRecordController.index);
routes.post("/dangers", DangerRecordController.store);
routes.delete("/dangers/:id", DangerRecordController.destroy);

routes.get("/", (req, res) => {
  return res.send("Ola Mundo 2");
});

module.exports = routes;
