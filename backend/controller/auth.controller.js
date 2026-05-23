const {sendVerificatioCode, WelcomeEmail} = require('../middleware/email')
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {
    try {
        const {email, name, password} = req.body
        if(!email || !name || !password){
            return res.status(400).json({error: 'All fields are required'})
        }
        const existUsers = await User.findOne({email})
        if(existUsers){
            return res.status(400).json({error: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 3 * 60 * 1000
        const user = await User.create({
            email,
            name,
            password: hashedPassword,
            verificationCode,
            verificationCodeExpires : expiresAt
        })
        sendVerificatioCode(user.email, user.name, verificationCode)
        const { password: _, ...userWithoutPassword } = user.toObject()
        res.status(200).json({success: true, user}).select('-password')
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


const resend = async (req, res) => {
    try {
        const user = await User.findOne({email}).select('-password')
        if(!user){
            console.log(user)
            return res.status(400).json({error: 'User not found'})
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCodeExpires = Date.now() + 1 * 60 * 1000;
        user.verificationCode = verificationCode
        await user.save()
        sendVerificatioCode(user.email, user.name, verificationCode)
        res.status(200).json({success: true, user})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}


const verifyEmail = async(req, res) => {
    try {
        const {code} = req.body
        const user = await User.findOne({verificationCode: code}).select('-password')
        if(!user){
            return res.status(400).json({error: 'Invalid code'})
        }
        if(user.verificationCodeExpires < Date.now()){
            return res.status(400).json({error: 'Code expired'})
        }
        user.isVerified = true
        user.verificationCode = null
        user.verificationCodeExpires = null
        await user.save()
        await WelcomeEmail(user.email, user.name)
        res.status(200).json({success: true, user})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// OTP send
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: 'User not found' })

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
        user.verificationCode = resetCode
        user.verificationCodeExpires = Date.now() + 3 * 60 * 1000
        await user.save()

        sendVerificatioCode(user.email, user.name, resetCode)
        res.status(200).json({ success: true, message: 'OTP sent' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// New password set
const resetPassword = async (req, res) => {
    try {
        const { code, newPassword } = req.body
        const user = await User.findOne({ verificationCode: code })
        if (!user) return res.status(400).json({ error: 'Invalid code' })

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ error: 'Code expired' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.verificationCode = null
        user.verificationCodeExpires = null
        await user.save()

        res.status(200).json({ success: true, message: 'Password has been reset' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



// Login

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: 'User not found' })

        if (!user.isVerified) {
            return res.status(400).json({
                error: 'First Verify the email',
                isVerified: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Wrong password' })

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,             
            sameSite: "lax",            
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
    res.status(200).json({ success: true, user, token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logout = async (req, res) => {
        res.clearCookie("token", {
        httpOnly: true,
        secure: false,       
        sameSite: "lax",    
    });
    res.status(200).json({ success: true, message: "Logout successful" });
}

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}



module.exports = { register, resend, verifyEmail, forgotPassword, resetPassword, login, logout, getCurrentUser }