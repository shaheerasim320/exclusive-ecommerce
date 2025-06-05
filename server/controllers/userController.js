import User from "../models/User.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import dotenv from "dotenv"
import jwt, { decode } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import axios from "axios"
import Counter from "../models/Counter.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";

dotenv.config()

export const registerUser = async (req, res) => {
    const { fullName, email, password, phoneNumber, gender } = req.body;
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User with this email exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const counter = await Counter.findOneAndUpdate({ id: "customer_counter" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        const custID = counter.seq;
        const user = new User({ fullName, email, password: hashedPassword, phoneNumber, gender, status: "unverified", custID })
        const savedUser = await user.save()
        const cart = new Cart({ user: savedUser._id })
        const savedCart = await cart.save()
        savedUser.cart = savedCart._id
        await savedUser.save()
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );
        const logo = "https://res.cloudinary.com/dmsuypprq/image/upload/v1738489765/bxe3q3uoapzktpuplggn.png"
        const verificationLink = `http://localhost:5173/email/verify?token=${token}`;
        await axios.post(
            process.env.API_URL,
            {
                sender: { email: "shaheerasim320@gmail.com", name: "Shaheer Asim" },
                to: [{ email: email }],
                subject: "Verify Your Email - Exclusive",
                htmlContent: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email</title>
                    </head>
                    <body>
                        <div style="padding: 40px; background-color: white; border:1px solid black; border-radius: 6px;">
                            <div style=" width:120px; height: 120px; margin:0px auto">
                                <img src=${logo} alt="logo" style="width: 120px; height: 120px;">
                            </div>
                            <div style=" width:320px; margin: 28px auto;">
                                <h2 style="width:320px ; display:block; font-weight: 600; font-size: 28px; text-align: center;">Please verify your email</h2>
                                <span style="width: 318px; text-align: center; font-size: 15px;">To use Exclusive, click the verification button below. This helps keep your account secure.</span>
                            </div>
                            <div style="width: 154px;  margin: 40px auto;">
                                <a href=${verificationLink} style="display: block; background-color: #DB4444; text-decoration: none; text-align: center; color: white; width: 154px; border-radius: 8px; padding: 11px 0px;" >Verify my account</a>
                            </div>
                            <div style="width: 318px; margin: 0 auto;">
                                <p style="width: 318px; font-size: 15px; text-align: center;">
                                    "This verification link is valid for 10 minutes. If you didn't request this, ignore this email."
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        res.status(201).json({
            message: "User registered. Please check your email to verify your account.",
        })
    } catch (error) {
        let errorMessage = "User validation failed. Please check your details.";

        if (error.message.includes('email')) {
            errorMessage = "User validation failed: Email is invalid or already in use. Please check your details.";
        } else if (error.message.includes('phoneNumber')) {
            errorMessage = "User validation failed: Phone number is invalid. Please check your details.";
        } else if (error.message.includes('password')) {
            errorMessage = "User validation failed: Password must meet the required criteria. Please check your details.";
        } else if (error.message.includes('gender')) {
            errorMessage = "User validation failed: Gender is required. Please check your details.";
        }
        res.status(400).json({ message: errorMessage });
    }
}

export const addCustomer = async (req, res) => {
    try {
        const { name, email, phoneNumber, gender } = req.body;
        if (!name || !email || !phoneNumber || !gender) {
            return res.status(400).json({ message: "Incomplete details" });
        }

        const existingCustomer = await User.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer with provided email exists" });
        }
        const counter = await Counter.findOneAndUpdate({ id: "customer_counter" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
        const custID = counter.seq;
        const hashedPassword = await bcrypt.hash("AdminSetPassword0000", 10);

        const user = new User({
            fullName: name,
            email,
            password: hashedPassword,
            gender,
            phoneNumber,
            custID,
            ...(req.body.addresses && { addresses: req.body.addresses }),
            ...(req.body.defaultShippingAddress && { defaultShippingAddress: req.body.defaultShippingAddress }),
            ...(req.body.defaultBillingAddress && { defaultBillingAddress: req.body.defaultBillingAddress })
        });

        const savedUser = await user.save();

        const cart = new Cart({ user: savedUser._id });
        const savedCart = await cart.save();

        savedUser.cart = savedCart._id;
        await savedUser.save();

        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const logo = "https://res.cloudinary.com/dmsuypprq/image/upload/v1738489765/bxe3q3uoapzktpuplggn.png";
        const passwordSetLink = `http://localhost:5173/password-form?create=true&token=${token}`;

        await axios.post(
            process.env.API_URL,
            {
                sender: { email: "shaheerasim320@gmail.com", name: "Shaheer Asim" },
                to: [{ email }],
                subject: "Set Your Password - Exclusive",
                htmlContent: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Set Password</title>
                    </head>
                    <body>
                        <div style="padding: 40px; background-color: white; border:1px solid black; border-radius: 6px;">
                            <div style="width:120px; height:120px; margin:0 auto;">
                                <img src=${logo} alt="Exclusive" style="width:100%; height:100%;">
                            </div>
                            <div style="width:320px; margin:28px auto;">
                                <h2 style="font-weight:600; font-size:28px; text-align:center;">Welcome to Exclusive</h2>
                                <p style="text-align:center; font-size:15px;">Please click the button below to set your password and activate your account.</p>
                            </div>
                            <div style="width:154px; margin:40px auto;">
                                <a href="${passwordSetLink}" style="display:block; background-color:#DB4444; text-decoration:none; text-align:center; color:white; width:154px; border-radius:8px; padding:11px 0;">Set Your Password</a>
                            </div>
                            <div style="width:318px; margin:0 auto;">
                                <p style="text-align:center; font-size:13px;">This password setup link is valid for 1 hour. If you didn't request this, you can ignore this email.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(201).json({ message: "Customer created. An email has been sent to set their password." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong while creating the customer." });
    }
};

export const setPassword = async (req, res) => {
    const { token, password } = req.body
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedUser = await User.findByIdAndUpdate(decoded.userId, { status: "verified", password: hashedPassword }, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        } else {
            return res.status(400).json({ message: "Invalid token" });
        }
    }
}

export const verifyUser = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const updatedUser = await User.findByIdAndUpdate(decoded.userId, { status: "verified" }, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.status(200).json({ message: "User verified successfully" });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        } else {
            return res.status(400).json({ message: "Invalid token" });
        }
    }
};

export const resendToken = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });
        const logo = "https://res.cloudinary.com/dmsuypprq/image/upload/v1738489765/bxe3q3uoapzktpuplggn.png";

        const isAdminPassword = await bcrypt.compare("AdminSetPassword0000", user.password);
        // Determine the purpose: verification or password setup
        let subject, htmlContent;

        if (isAdminPassword) {
            // Admin-created user: password setup email
            const passwordSetLink = `http://localhost:5173/password-form?create=true&token=${token}`;
            subject = "Set Your Password - Exclusive";
            htmlContent = `
                <div style="padding: 40px; background-color: white; border:1px solid black; border-radius: 6px;">
                    <div style="width:120px; height:120px; margin:0 auto;">
                        <img src=${logo} alt="Exclusive" style="width:100%; height:100%;">
                    </div>
                    <div style="width:320px; margin:28px auto;">
                        <h2 style="font-weight:600; font-size:28px; text-align:center;">Set Your Password</h2>
                        <p style="text-align:center; font-size:15px;">Click the button below to set your password and activate your account.</p>
                    </div>
                    <div style="width:154px; margin:40px auto;">
                        <a href="${passwordSetLink}" style="display:block; background-color:#DB4444; text-decoration:none; text-align:center; color:white; border-radius:8px; padding:11px 0;">Set Your Password</a>
                    </div>
                    <p style="text-align:center; font-size:13px;">This link is valid for 30 minutes.</p>
                </div>
            `;
        } else {
            // Self-registration: verification email
            const verificationLink = `http://localhost:5173/email/verify?token=${token}`;
            subject = "Verify Your Email - Exclusive";
            htmlContent = `
            <div style="padding: 40px; background-color: white; border:1px solid black; border-radius: 6px;">
                <div style=" width:120px; height: 120px; margin:0px auto">
                    <img src=${logo} alt="logo" style="width: 120px; height: 120px;">
                </div>
                <div style=" width:320px; margin: 28px auto;">
                    <h2 style="font-weight: 600; font-size: 28px; text-align: center;">Please verify your email</h2>
                    <p style="text-align: center; font-size: 15px;">Click the button below to verify your account.</p>
                </div>
                <div style="width: 154px;  margin: 40px auto;">
                    <a href="${verificationLink}" style="display: block; background-color: #DB4444; text-decoration: none; text-align: center; color: white; border-radius: 8px; padding: 11px 0px;">Verify My Account</a>
                </div>
                <p style="text-align: center; font-size: 13px;">This link is valid for 30 minutes.</p>
            </div>
        `;
        }


        // Send email via Brevo (Sendinblue)
        await axios.post(
            process.env.API_URL,
            {
                sender: { email: "shaheerasim320@gmail.com", name: "Shaheer Asim" },
                to: [{ email }],
                subject,
                htmlContent
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({ message: "A new link has been sent to your email address." });

    } catch (error) {
        console.error("Resend token error:", error);
        res.status(500).json({ message: "Failed to send email. Please try again." });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ message: "Email not provided" })

    try {
        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

        if (user.status == "unverified") return res.status(403).json({ message: "User is not verified" })

        user.password = undefined
        user.createdAt = undefined
        user.updatedAt = undefined

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "Strict"
        })

        res.status(200).json({
            message: "Login Successful",
            user: user,
            accessToken
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decoded.userId);

        return res.status(200).json({ accessToken: newAccessToken })
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}
export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const refreshUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -createdAt -updatedAt");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAccessToken = jwt.sign({ userId: req.user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "Lax",
        });

        res.status(200).json({
            message: "User session refreshed",
            user
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token, please log in again." });
    }
}

export const updateProfile = async (req, res) => {
    const userID = req.user.userId;
    let hashedPassword = "";

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.currentPassword != "" && req.body.newPassword != "") {
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(400).json({ message: "New password and confirmation password do not match" });
            }
            if (req.body.currentPassword === req.body.newPassword) {
                return res.status(400).json({ message: "New password is similar to current password" })
            }
            hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            user.password = hashedPassword;
        }

        if (req.body.fullName) user.fullName = req.body.fullName;
        if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
        if (req.body.gender) user.gender = req.body.gender;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error in updating user profile" });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: { $ne: "admin" } }).select('-password');
        res.status(200).json(customers)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error in fetching customers" });
    }
}


