//they define the endpoints for user-related operations, such as creating a new user, retrieving user information, updating user details, and deleting a user. They map HTTP methods (GET, POST, PUT, DELETE) to specific controller functions that handle the corresponding logic.
import  {Router} from 'express';
import { registerUser, LoginUser, logoutUser } from '../controllers/user.contollers.js';

const router = Router();

router.route('/register').post(registerUser); //specifies that when a POST request is made to the /register endpoint, the registerUser controller function will be invoked to handle the request.
router.route('/login').post(LoginUser); 
router.route('/logout').post(logoutUser);

export default router;