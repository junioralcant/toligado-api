const express = require("express");
const multer = require("multer");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const DangerRecordController = require("./app/controllers/DangerRecordController");
const ImageController = require("./app/controllers/ImageController");
const AdminController = require("./app/controllers/AdminController");
const DrawController = require("./app/controllers/DrawController");

const middleware = require("./app/middleware/auth");
const multerConfig = require("./config/multer");

const routes = express.Router();

routes.post("/sessions", SessionController.store);

routes.post("/users", UserController.store);
routes.post("/admins", AdminController.store);

routes.use(middleware);

routes.get("/users", UserController.index);

/**
 * Image
 */
routes.post(
  "/images",
  multer(multerConfig).single("file"),
  ImageController.store
);
routes.get("/images", ImageController.index);
routes.delete("/images/:id", ImageController.destroy);

/**
 * Draw
 */
routes.post(
  "/draws", DrawController.store
);
routes.get("/draws", DrawController.index);
routes.get("/draws/:id", DrawController.show);
routes.delete("/draws/:id", DrawController.destroy);

/**
 * Danger Record
 */
routes.get("/dangers", DangerRecordController.index);
routes.post(
  "/dangers",
  multer(multerConfig).single("file"),
  DangerRecordController.store
);
routes.put("/dangers/:id", DangerRecordController.updade);
routes.get("/dangers/:id", DangerRecordController.show);
routes.delete("/dangers/:id", DangerRecordController.destroy);

module.exports = routes;
