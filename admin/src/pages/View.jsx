import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const View = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [product, setProduct] = useState(null);

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

        setProduct(response.data.product);
        setSelectedImage(response.data.product.image?.[0] || "");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load product");
        navigate("/list");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, token, navigate]);

  if (loading) {
    return <div className="py-4">Loading product...</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/edit/${product._id}`)}
            className="px-4 py-2 bg-black text-white"
          >
            Edit Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="px-4 py-2 border border-gray-300"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 bg-white border border-gray-200 p-5">
        <div>
          <div className="w-full border border-gray-200 bg-gray-50 p-2">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full max-h-[430px] object-contain"
              />
            ) : (
              <div className="h-[260px] flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {product.image?.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {product.image.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`border p-1 ${selectedImage === image ? "border-black" : "border-gray-200"}`}
                >
                  <img
                    src={image}
                    alt={`${product.name}-${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="text-base font-medium text-gray-900">{product.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Description</p>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Sub Category</p>
              <p className="font-medium">{product.subCategory}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-medium">
                {currency}
                {product.price}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Stock Status</p>
              <p className="font-medium">{product.stockStatus || "In Stock"}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500">Best Seller</p>
            <p className="font-medium">{product.bestseller ? "Yes" : "No"}</p>
          </div>

          <div>
            <p className="text-gray-500">Created At</p>
            <p className="font-medium">
              {product.date ? new Date(product.date).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
