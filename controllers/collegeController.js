const College = require('../models/college'); 


const sendSuccessResponse = (college, statusCode, res, message) => {
    res.status(statusCode).json({
        success: true,
        message: message,
        data: {
            college: {
                _id: college._id,
                email: college.email,
                collegeName: college.collegeName,
               
            }
        },
    });
};


exports.registerCollege = async (req, res, next) => {
    try {
        const { collegeName, email, password, tpoName, tpoEmail, tpoPhone, website } = req.body;

        const newCollege = await College.create({
            collegeName,
            email,
            password,
            tpoName,
            tpoEmail,
            tpoPhone,
            website
        });

        sendSuccessResponse(newCollege, 201, res, 'College registered successfully.');

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'This email address is already registered.' });
        }
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};


exports.loginCollege = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    try {
        
        const college = await College.findOne({ email: email.toLowerCase() }).select('+password');

        
        if (!college || college.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        
        sendSuccessResponse(college, 200, res, 'Login successful.');

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};