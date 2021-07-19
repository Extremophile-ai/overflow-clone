import { Router } from 'express';
import UserController from '../controller/user.controller';
import Authentication from '../middleware/auth';
import QuestionController from '../controller/questions.controller';

const { createNewUser, login } = UserController;
const { authenticate } = Authentication;
const {
  createNewQuestion, addAnswer,
  addResponse, selectAnswer,
  viewQuestion, search
} = QuestionController;

const router = Router();

router.post('/user/signup', createNewUser);
router.post('/user/login', login);
router.post('/user/ask-questions', authenticate, createNewQuestion);
router.post('/user/add-answer/:questionId', authenticate, addAnswer);
router.post('/user/add-comment/:questionId/:feedbackId', authenticate, addResponse);
router.post('/user/select-answer/:questionId/:answerId', authenticate, selectAnswer);
router.get('/user/view-questions/:questionId', viewQuestion);
router.get('/user/search', search);

export default router;
