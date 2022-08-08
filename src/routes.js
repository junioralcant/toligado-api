const express = require('express');
const multer = require('multer');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const DangerRecordController = require('./app/controllers/DangerRecordController');
const ImageController = require('./app/controllers/ImageController');
const AdminController = require('./app/controllers/AdminController');
const DrawController = require('./app/controllers/DrawController');
const ResolvedDangerController = require('./app/controllers/ResolvedDangerController');

const middleware = require('./app/middleware/auth');
const multerConfig = require('./config/multer');
const CompanyController = require('./app/controllers/CompanyController');

const routes = express.Router();

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);
routes.post('/admins', AdminController.store);

routes.use(middleware);

routes.get('/users', UserController.index);

/**
 * Image
 */
routes.post(
  '/images',
  multer(multerConfig).single('file'),
  ImageController.store
);
routes.get('/images', ImageController.index);
routes.delete('/images/:id', ImageController.destroy);

/**
 * Draw
 */
routes.post('/draws', DrawController.store);
routes.get('/draws', DrawController.index);
routes.get('/draws/:id', DrawController.show);
routes.delete('/draws/:id', DrawController.destroy);

/**
 * Company
 */
routes.post('/companies', CompanyController.store);
routes.get('/companies', CompanyController.index);
routes.put('/companies/:id', CompanyController.update);
routes.delete('/companies/:id', CompanyController.destroy);

/**
 * Danger Record
 */
routes.get('/dangers', DangerRecordController.index);
routes.post(
  '/dangers',
  multer(multerConfig).single('file'),
  DangerRecordController.store
);
routes.put('/dangers/:id', DangerRecordController.updade);
routes.get('/dangers/:id', DangerRecordController.show);
routes.delete('/dangers/:id', DangerRecordController.destroy);

routes.put(
  '/resolved/:id',
  multer(multerConfig).single('file'),
  ResolvedDangerController.update
);

module.exports = routes;
