import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

// ------- CATEGORY → SUBCATEGORY MAP -------
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
    "Thermistors - NTC"
  ],
  "Active Components": [
    "Diodes",
    "Transistors (BJT, MOSFET)",
    "Thyristors"
  ],
  "Integrated Circuits (ICs)": [
    "Microcontrollers",
    "Microprocessors",
    "Logic ICs",
    "Amplifiers",
    "Power Management"
  ],
  "Electromechanical": [
    "Switches",
    "Relays",
    "Motors and Drivers",
    "Solenoids"
  ],
  "Connectors": [
    "Headers",
    "Terminal Blocks",
    "RF/Coaxial Connectors",
    "Cable Assemblies"
  ],
  "Development Tools": [
    "Development Boards (Arduino, Raspberry Pi)",
    "Breadboards"
  ],
  "Power Supplies": [
    "AC Power Supplies",
    "DC Power Supplies",
    "AC/DC Converters",
    "DC/DC Converters",
    "Batteries",
    "Battery Holders",
    "Transformers"
  ]
};

// ---------- IMAGE COMPRESSION FUNCTION -----------
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

        const canvas = document.createElement('canvas');
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

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, { type: file.type });

          if (newFile.size / 1024 / 1024 > maxSizeMB && quality > 0.3) {
            compressImage(file, maxSizeMB, quality - 0.1).then(resolve);
          } else resolve(newFile);
        }, file.type, quality);
      };
    };
  });
};

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [displayImages, setDisplayImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  const [compressing, setCompressing] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const MAX_TOTAL_SIZE = 9;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState("Development Boards");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState('');
  const [bestseller, setBestseller] = useState(false);

  // --- Update total image size ---
  useEffect(() => {
    let size = 0;
    if (image1) size += image1.size;
    if (image2) size += image2.size;
    if (image3) size += image3.size;
    if (image4) size += image4.size;

    setTotalSize(size / (1024 * 1024));
  }, [image1, image2, image3, image4]);

  // --- Handle category selection (update subcategories) ---
  useEffect(() => {
    const availableSub = SUBCATEGORY_OPTIONS[category];
    setSubCategory(availableSub ? availableSub[0] : "");
  }, [category]);

  // ---- Image select handler ----
  const handleImageSelect = async (e, setImageFunction, key) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCompressing(true);

      setDisplayImages((prev) => ({
        ...prev,
        [key]: URL.createObjectURL(file)
      }));

      const fileSize = file.size / 1024 / 1024;
      let targetMaxSize = 2;

      if (fileSize > targetMaxSize) {
        const compressedFile = await compressImage(file, targetMaxSize);
        setImageFunction(compressedFile);
      } else {
        setImageFunction(file);
      }
    } finally {
      setCompressing(false);
    }
  };

  // -------- FORM SUBMIT --------
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`Total image size exceeds ${MAX_TOTAL_SIZE}MB`);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("price", price);
    formData.append("bestseller", bestseller);

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    try {
      const toastId = toast.loading("Adding product...");

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token }, timeout: 60000 }
      );

      if (response.data.success) {
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
        resetForm();
      } else {
        toast.update(toastId, {
          render: response.data.message,
          type: "error",
          isLoading: false
        });
      }
    } catch (error) {
      toast.error("Upload failed!");
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setDisplayImages({
      image1: null,
      image2: null,
      image3: null,
      image4: null
    });
    setBestseller(false);
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">

      {/* IMAGE UPLOAD */}
      <div>
        <p>Upload Images {compressing && "(Processing...)"}</p>
        <div className="flex gap-2 mt-2">
          {["image1", "image2", "image3", "image4"].map((key, index) => (
            <label key={index} htmlFor={key} className="cursor-pointer">
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
                disabled={compressing}
                onChange={(e) =>
                  handleImageSelect(
                    e,
                    [
                      setImage1,
                      setImage2,
                      setImage3,
                      setImage4
                    ][index],
                    key
                  )
                }
              />
            </label>
          ))}
        </div>

        <p className={`text-sm ${totalSize > MAX_TOTAL_SIZE ? "text-red-600" : "text-gray-600"}`}>
          Total: {totalSize.toFixed(2)} MB / {MAX_TOTAL_SIZE} MB
        </p>
      </div>

      {/* PRODUCT NAME */}
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

      {/* DESCRIPTION */}
      <div className="w-full">
        <p>Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          required
        />
      </div>

      {/* CATEGORY + SUBCATEGORY */}
      <div className="flex flex-col sm:flex-row gap-5 w-full mt-3">

        {/* CATEGORY */}
        <div>
          <p className="mb-2">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2"
          >
            {Object.keys(SUBCATEGORY_OPTIONS).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* SUBCATEGORY */}
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-3 py-2"
          >
            {SUBCATEGORY_OPTIONS[category]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* PRICE */}
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
      </div>

      {/* BESTSELLER */}
      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
        />
        <label>Add to BestSeller</label>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white disabled:bg-gray-400"
      >
        {compressing ? "Processing..." : "ADD"}
      </button>

    </form>
  );
};

export default Add;
