import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

//add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      stockStatus, // New field
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
      stockStatus: stockStatus || "In Stock",
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//list product
// List products sorted by most recent (newest first)
const listProducts = async (req, res) => {
  try {
    // Sort by date field in descending order so newest products appear first
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//single product info
const singleProduct = async (req, res) => {
  try {
    const productId = req.body?.productId || req.params?.id;
    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update existing product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params?.id || req.body?.productId;
    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.subCategory !== undefined) updateData.subCategory = req.body.subCategory;

    if (req.body.bestseller !== undefined) {
      updateData.bestseller = req.body.bestseller === "true" || req.body.bestseller === true;
    }

    if (req.body.stockStatus !== undefined) {
      if (!["In Stock", "Out of Stock", "Limited Stock"].includes(req.body.stockStatus)) {
        return res.json({
          success: false,
          message: "Invalid stock status. Must be 'In Stock', 'Out of Stock', or 'Limited Stock'",
        });
      }
      updateData.stockStatus = req.body.stockStatus;
    }

    const updatedImages = [...(product.image || [])];

    let removeImageIndexes = [];
    if (req.body.removeImageIndexes) {
      try {
        const parsedIndexes = JSON.parse(req.body.removeImageIndexes);
        if (Array.isArray(parsedIndexes)) {
          removeImageIndexes = parsedIndexes
            .map((index) => Number(index))
            .filter((index) => Number.isInteger(index) && index >= 0 && index <= 3);
        }
      } catch (parseError) {
        return res.json({ success: false, message: "Invalid removeImageIndexes format" });
      }
    }

    removeImageIndexes.forEach((index) => {
      updatedImages[index] = null;
    });

    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const incomingImages = [image1, image2, image3, image4];

    for (let index = 0; index < incomingImages.length; index += 1) {
      const file = incomingImages[index];
      if (!file) continue;

      const uploaded = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
      updatedImages[index] = uploaded.secure_url;
    }

    const finalImages = updatedImages.filter(Boolean);
    if (finalImages.length === 0) {
      return res.json({ success: false, message: "At least one product image is required" });
    }

    updateData.image = finalImages;

    await productModel.findByIdAndUpdate(productId, updateData);

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update product stock status
const updateStockStatus = async (req, res) => {
  try {
    const { productId, stockStatus } = req.body;

    if (!["In Stock", "Out of Stock", "Limited Stock"].includes(stockStatus)) {
      return res.json({
        success: false,
        message: "Invalid stock status. Must be 'In Stock', 'Out of Stock', or 'Limited Stock'",
      });
    }

    await productModel.findByIdAndUpdate(productId, { stockStatus });
    res.json({ success: true, message: "Stock status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update product best seller status
const updateBestSeller = async (req, res) => {
  try {
    const { productId, bestseller } = req.body;
    await productModel.findByIdAndUpdate(productId, { bestseller });
    res.json({ success: true, message: "Best seller status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  singleProduct,
  removeProduct,
  listProducts,
  addProduct,
  updateStockStatus, // New function export
  updateBestSeller,
  updateProduct,
};
