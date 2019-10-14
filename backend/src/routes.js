import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import EnrollmentController from './app/controllers/EnrollmentController';
import ScheduleController from './app/controllers/ScheduleController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.get('/meetups/schedule', ScheduleController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.get('/meetups', MeetupController.index);
routes.put('/meetups/:meetup_id', MeetupController.update);
routes.delete('/meetups/:meetup_id', MeetupController.delete);

routes.post('/meetups/:meetup_id/enrollments', EnrollmentController.store);

export default routes;
