import { Auth2Client } from "../config/google.js"
import User from "../model/user.js"
import { sendResetPasswordEmail } from "../services/email.service.js"
import { findOrCreateGoogleUser, getUserById } from "../services/user.services.js"
import { createToken } from "../utils/jwt.js"
import bcrypt from "bcrypt"
import crypto from "crypto";

export const googleLogin = (req, res) => {
    const url = Auth2Client.generateAuthUrl({
        access_type: "online",
        scope: [
           "openid",
            "email",
            "profile"
        ],
         prompt: "consent"
    })
    
    res.redirect(url)
}

export const googleCallback = async (req, res) => {
    try {
    const { code } = req.query
    console.log("code", code)
    const {tokens} = await Auth2Client.getToken(code)
    console.log("tokens", tokens)

    const ticket = await Auth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience:process.env.GOOGLE_CLIENT_ID,
    })
    console.log("ticket",ticket)
    const data = ticket.getPayload(ticket)
    console.log("google Data", data)
        const user = await findOrCreateGoogleUser(data);
        console.log("user", user)
    const jwtToken = createToken({
      userId: user._id,
      email: user.email,
    })
console.log("jwtToken", jwtToken)
    res.cookie("authToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.redirect(`${process.env.FRONTEND_URL}`)
    } catch (error) {
      console.error("OAuth callback error:", error);
     return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
    }

}

export const userProfile = async (req,res) => {
    const {userId} = req.user
    try {
    const user = await getUserById(userId)

    if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
    }
       
    return res.status(200).json({ message: "user data", user })
    } catch (error) {
        console.error("userProfile error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const logout = async (req,res) => {
     res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    })
    return  res.status(200).json({ message: "Logged out successfully" });

}

export const userRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const isUser = await User.findOne({ email });

        if (isUser) {
            return res.status(409).json({
                message: "User already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const jwtToken = createToken({
            userId: user._id,
            email: user.email,
        })
        res.cookie("authToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(201).json({
            message: "User created successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password,isRequired } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const jwtToken = createToken({
            userId: user._id,
            email: user.email,
        }, isRequired? "30d" : "1d")
        res.cookie("authToken", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: "User logged in successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const sendPasswordLink = async (req, res) => {
    console.log("run")
    try {
        const { email } = req.body
        console.log("email",email)
        if (!email) {
            return res.status(400).json({
                message:"Please provide your email"
            })
        }
        const user = await User.findOne({
            email:email
        })
        if (!user) {
            return res.status(200).json({
    message: "If an account exists for that email, a reset link has been sent"
})

        }
        const token = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
        user.resetPasswordToken = hashedToken
        await user.save()

        const resetLink =
  `${process.env.FRONTEND_URL}/reset-password/${token}`;

       await sendResetPasswordEmail(email, resetLink);
        return res.status(200).json({
            message:"If an account exists for that email, a reset link has been sent"
        })
    } catch (error) {
        console.error(error)
         return res.status(500).json({
    message: "Internal server error"
})

    }
}

export const resetPassword = async (req,res) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const tokenHash = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message:"This reset link is invalid or has expired"
            })
        }

        if (!password) {
            return res.status(400).json({
                message:"Please provide your password"
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                message:"Password must be at least 8 characters"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message:"Password updated successfully"
        })
    } catch (error) {
        console.error(error)
         return res.status(500).json({
    message: "Internal server error"
})

    }
}
export const verifyLink = async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({
                message: "Please provide a token"
            })
        }

        const tokenHash = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "This reset link is invalid or has expired"
            })
        }

        return res.status(200).json({
            message: "Link is valid"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}