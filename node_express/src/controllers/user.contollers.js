//controllers handle the logic of the application and interact with the database. They receive requests from the routes, process them, and send responses back to the client.
import { User } from '../modules/user.model.js';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({ message: 'Password must be between 6 and 20 characters' });
        }

        // check if user already exists by email or username
        const existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // create new user
        const user = await User.create({ 
            username, 
            email: email.toLowerCase(), 
            password,
        });
        return res.status(201).json({ message: 'User registered successfully', 
            user: {id: user._id, email: user.email, username: user.username} 
        });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field';
            return res.status(400).json({ message: `User with this ${field} already exists` });
        }
        return res.status(500).json({ message: 'Error registering user' });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        //check if user exists
        const user = await User.findOne({ 
            email: email.toLowerCase() 
        });

        //if user does not exist
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        };

        //if password is incorrect
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'User logged in successfully', 
            user: {id: user._id, email: user.email, username: user.username} 
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ message: 'Error logging in user' });
    }
}

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        return res.status(500).json({ message: 'Error logging out user' });
    }
};

export { registerUser, LoginUser, logoutUser };