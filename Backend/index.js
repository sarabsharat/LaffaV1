const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { OAuth2Client } = require("google-auth-library");
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const app = express();
const port = 2000;

// ===============================
// ✅ Firebase Initialization
// ===============================
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ===============================
// ✅ Middleware
// ===============================
app.use(express.json());
app.use(cors());

// ===============================
// ✅ MongoDB Connection
// ===============================
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connection is open");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ===============================
// ✅ File Upload Setup
// ===============================
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use('/images', express.static(uploadDir));

// ===============================
// ✅ User Schema
// ===============================
const Users = mongoose.model("Users", new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  phoneNumber: { type: Number, unique: true, sparse: true },
  phoneVerified: { type: Boolean, default: false },
  password: { type: String },
  province: { type: String },
  area: { type: String },
  street: { type: String },
  cartData: { type: Object },
  Date: { type: Date, default: Date.now }
}));

// ===============================
// ✅ Phone Verification Helper
// ===============================
async function verifyPhoneCode(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.phone_number ? true : false;
  } catch (error) {
    console.error("❌ Phone verification failed:", error);
    return false;
  }
}

// ===============================
// ✅ Signup Endpoint
// ===============================
app.post("/signup", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phoneNumber,
      idToken,
      googleId,
      province,
      area,
      street
    } = req.body;

    // GOOGLE SIGNUP
    if (googleId) {
      const existingGoogleUser = await Users.findOne({ googleId });
      if (existingGoogleUser) return res.status(400).json({ success: false, errors: "Google account already registered" });

      const newGoogleUser = new Users({
        username, email, googleId, province, area, street, cartData: {}
      });
      await newGoogleUser.save();

      const token = jwt.sign({ userId: newGoogleUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.status(201).json({ success: true, message: "Google user registered", token });
    }

    // EMAIL + PHONE SIGNUP
    if (!email || !password || !phoneNumber || !idToken) {
      return res.status(400).json({ success: false, errors: "Missing required fields" });
    }

    if (await Users.findOne({ email })) return res.status(400).json({ success: false, errors: "Email already in use" });
    if (await Users.findOne({ username })) return res.status(400).json({ success: false, errors: "Username already taken" });
    if (await Users.findOne({ phoneNumber })) return res.status(400).json({ success: false, errors: "Phone number already registered" });

    const phoneVerified = await verifyPhoneCode(idToken);
    if (!phoneVerified) return res.status(400).json({ success: false, errors: "Invalid phone verification token" });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = new Users({
      username, email, password: hashedPassword, phoneNumber,
      phoneVerified: true, province, area, street, cartData: {}
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ success: true, message: "User registered successfully", token });

  } catch (error) {
    console.error("❌ Error in signup:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});


// ===============================
// ✅loginginging
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { email, password, tokenId } = req.body;

    // ---------- GOOGLE LOGIN ----------
    if (tokenId) {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await Users.findOne({ email: payload.email });

      if (!user) {
        user = new Users({
          username: payload.name || payload.email.split("@")[0],
          email: payload.email,
          googleId: payload.sub,
          password: "",
          province: "",
          area: "",
          street: "",
          cartData: {}
        });
        await user.save();
      }

      const data = { user: { id: user._id } };
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ authToken });
    }

    // ---------- NORMAL EMAIL/PASSWORD LOGIN ----------
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) return res.status(400).json({ error: "Invalid password" });

    const data = { user: { id: user._id } };
    const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });
    res.json({ authToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// ✅ Base Route
// ===============================
app.get('/', (req, res) => {
  res.send("Express is running");
});

// ===============================
// ✅ Start Server
// ===============================
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
