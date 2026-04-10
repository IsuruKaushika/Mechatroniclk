import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { backendUrl } from "../App";
import { IoIosClose } from "react-icons/io";

const SUBCATEGORY_OPTIONS = {
  "Passive Components": [
    "Resistors",
    "Capacitors",
    "Inductors, Chokes & Coils",
    "Filters",
    "Frequency Control & Timing Devices",
    "Encoders",
    "Potentiometers, Trimmers & Rheostats",
    "Antenna Accessories",
    "Thermistors - NTC",
  ],
  "Active Components": ["Diodes", "Transistors (BJT, MOSFET)", "Thyristors"],
  "Integrated Circuits (ICs)": [
    "Microcontrollers",
    "Microprocessors",
    "Logic ICs",
    "Amplifiers",
    "Power Management",
  ],
  Electromechanical: ["Switches", "Relays", "Motors and Drivers", "Solenoids"],
  Connectors: ["Headers", "Terminal Blocks", "RF/Coaxial Connectors", "Cable Assemblies"],
  "Development Tools": ["Development Boards (Arduino, Raspberry Pi)", "Breadboards"],
  "Power Supplies": [
    "AC Power Supplies",
    "DC Power Supplies",
    "AC/DC Converters",
    "DC/DC Converters",
    "Batteries",
    "Battery Holders",
    "Transformers",
  ],
};

const compressImage = async (file, maxSizeMB = 2, qualityTarget = 0.8) => {
  if (file.size / 1024 / 1024 < maxSizeMB) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const originalSize = file.size / 1024 / 1024;
        let quality = qualityTarget;

        if (originalSize > 8) quality = 0.5;
        else if (originalSize > 5) quality = 0.6;
        else if (originalSize > 3) quality = 0.7;

        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_DIMENSION = 2000;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const aspectRatio = width / height;
          if (width > height) {
            width = MAX_DIMENSION;
            height = Math.round(width / aspectRatio);
          } else {
            height = MAX_DIMENSION;
            width = Math.round(height * aspectRatio);
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const newFile = new File([blob], file.name, { type: file.type });

            if (newFile.size / 1024 / 1024 > maxSizeMB && quality > 0.3) {
              compressImage(file, maxSizeMB, quality - 0.1).then(resolve);
            } else {
              resolve(newFile);
            }
          },
          file.type,
          quality,
        );
      };
    };
  });
};

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [displayImages, setDisplayImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });
  const [removeImageIndexes, setRemoveImageIndexes] = useState([]);

  const [totalSize, setTotalSize] = useState(0);
  const MAX_TOTAL_SIZE = 9;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development Tools");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [stockStatus, setStockStatus] = useState("In Stock");

  useEffect(() => {
    const availableSub = SUBCATEGORY_OPTIONS[category];
    if (!availableSub || availableSub.length === 0) {
      setSubCategory("");
      return;
    }

    if (!availableSub.includes(subCategory)) {
      setSubCategory(availableSub[0]);
    }
  }, [category, subCategory]);

  useEffect(() => {
    let size = 0;
    if (image1) size += image1.size;
    if (image2) size += image2.size;
    if (image3) size += image3.size;
    if (image4) size += image4.size;
    setTotalSize(size / (1024 * 1024));
  }, [image1, image2, image3, image4]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/${id}`, {
          headers: { token },
        });

        if (!response.data.success || !response.data.product) {
          toast.error(response.data.message || "Failed to load product");
          navigate("/list");
          return;
        }

        const product = response.data.product;

        setName(product.name || "");
        setDescription(product.description || "");
        setCategory(product.category || "Development Tools");
        setSubCategory(product.subCategory || "");
        setPrice(product.price || "");
        setBestseller(Boolean(product.bestseller));
        setStockStatus(product.stockStatus || "In Stock");

        setDisplayImages({
          image1: product.image?.[0] || null,
          image2: product.image?.[1] || null,
          image3: product.image?.[2] || null,
          image4: product.image?.[3] || null,
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, token, navigate]);

  const handleImageSelect = async (e, setImageFunction, key) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageIndex = Number(key.replace("image", "")) - 1;

    try {
      setCompressing(true);

      setDisplayImages((prev) => ({
        ...prev,
        [key]: URL.createObjectURL(file),
      }));

      const compressedFile = await compressImage(file, 2);
      setImageFunction(compressedFile);
      setRemoveImageIndexes((prev) => prev.filter((index) => index !== imageIndex));
    } finally {
      setCompressing(false);
    }
  };

  const handleImageRemove = (key, index) => {
    [setImage1, setImage2, setImage3, setImage4][index](false);

    setDisplayImages((prev) => ({
      ...prev,
      [key]: null,
    }));

    setRemoveImageIndexes((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`Total image size exceeds ${MAX_TOTAL_SIZE}MB`);
      return;
    }

    const hasAtLeastOneImage = Object.values(displayImages).some((image) => Boolean(image));
    if (!hasAtLeastOneImage) {
      toast.error("At least one product image is required");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("bestseller", bestseller);
      formData.append("stockStatus", stockStatus);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);
      if (removeImageIndexes.length > 0) {
        formData.append("removeImageIndexes", JSON.stringify(removeImageIndexes));
      }

      const toastId = toast.loading("Updating product...");

      const response = await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
        headers: { token },
        timeout: 60000,
      });

      if (response.data.success) {
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 2500,
        });
        navigate("/list");
      } else {
        toast.update(toastId, {
          render: response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-4">Loading product...</div>;
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p>Edit Images {compressing && "(Processing...)"}</p>
        <div className="flex gap-2 mt-2">
          {["image1", "image2", "image3", "image4"].map((key, index) => (
            <div key={key} className="relative">
              <label htmlFor={key} className="cursor-pointer block">
                <img
                  className="w-20 h-20 border object-cover"
                  src={displayImages[key] || assets.upload_area}
                  alt=""
                />
                <input
                  type="file"
                  id={key}
                  hidden
                  accept="image/*"
                  disabled={compressing || saving}
                  onChange={(e) =>
                    handleImageSelect(e, [setImage1, setImage2, setImage3, setImage4][index], key)
                  }
                />
              </label>
              {displayImages[key] && (
                <button
                  type="button"
                  onClick={() => handleImageRemove(key, index)}
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black text-white text-xs"
                  disabled={saving || compressing}
                >
                  <IoIosClose className="m-auto w-full h-full" />
                </button>
              )}
              <input
                type="hidden"
                value={removeImageIndexes.includes(index) ? "removed" : "active"}
                readOnly
              />
            </div>
          ))}
        </div>
        <p className={`text-sm ${totalSize > MAX_TOTAL_SIZE ? "text-red-600" : "text-gray-600"}`}>
          New uploads: {totalSize.toFixed(2)} MB / {MAX_TOTAL_SIZE} MB
        </p>
      </div>

      <div className="w-full">
        <p>Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          required
        />
      </div>

      <div className="w-full">
        <p>Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-5 w-full mt-3">
        <div>
          <p className="mb-2">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2"
          >
            {Object.keys(SUBCATEGORY_OPTIONS).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-3 py-2"
          >
            {SUBCATEGORY_OPTIONS[category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            className="px-3 py-2 w-[120px]"
            required
          />
        </div>

        <div>
          <p className="mb-2">Stock Status</p>
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="px-3 py-2"
          >
            <option value="In Stock">In Stock</option>
            <option value="Limited Stock">Limited Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
          disabled={saving}
        />
        <label>Add to BestSeller</label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white disabled:bg-gray-400"
        disabled={saving || compressing}
      >
        {saving ? "Saving..." : "UPDATE"}
      </button>
    </form>
  );
};

export default Edit;
