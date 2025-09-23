const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 2000;

app.use(express.json());
app.use(cors());

// ===============================
// ✅ Mongoose Connection
// ===============================
mongoose.connect(
  'mongodb+srv://sarabsharat:LaffaV1%402025@cluster0.gpphils.mongodb.net/LaffaV1?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ===============================
// ✅ Image Upload Configuration
// ===============================
// Create upload directory if it doesn't exist
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
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

app.use('/images', express.static(uploadDir));

// ===============================
// ✅ Base Route
// ===============================
app.get('/', (req, res) => {
  res.send("Express is running");
});

// ===============================
// ✅ Upload Endpoint
// ===============================
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Error handling for upload
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: 0, message: 'File too large' });
    }
  }
  res.status(400).json({ success: 0, message: error.message });
});

// ===============================
// ✅ Product Schema and Model
// ===============================
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number,},
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] }
});

const Product = mongoose.model("Product", productSchema);

// ===============================
// ✅ Add Product Endpoint
// ===============================
app.post('/addproduct', async (req, res) => {
  try {
    // Find the highest ID to auto-increment
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      description: req.body.description,
      available: req.body.available !== undefined ? req.body.available : true,
      colors: req.body.colors || [],
      sizes: req.body.sizes || []
    });

    await newProduct.save();
    console.log("✅ Product Added:", newProduct);

    res.status(201).json({
      success: true,
      message: "Product Added",
      product: newProduct
    });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
});


// ===============================
// ✅ Delete Product Endpoint - Supports both DELETE and POST
// ===============================
app.delete('/deleteproduct/:id', async (req, res) => {
  await handleDeleteProduct(req, res);
});

// Add POST support for backward compatibility
app.post('/deleteproduct/:id', async (req, res) => {
  await handleDeleteProduct(req, res);
});

// Common delete handler function
async function handleDeleteProduct(req, res) {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const deletedProduct = await Product.findOneAndDelete({ id: productId });
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log("✅ Product Deleted:", deletedProduct.name);
    res.json({
      success: true,
      message: "Product Deleted",
      product: deletedProduct
    });

  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
}


// ===============================
// ✅ Get All Products Endpoint
// ===============================
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
});

// ===============================
// ✅ Get Product by ID Endpoint
// ===============================
app.get('/product/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
});

// ===============================
// api for getting all prodcuts
// ===============================

app.get('/allproducts',async(req,res)=>{
  let products = await Product.find({});
  console.log("all products");
  res.send(products);
  })


// ===============================
// ✅ Start Server
// ===============================
app.listen(port, (error) => {
  if (!error) {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  } else {
    console.log("❌ Error starting server:", error);
  }
});