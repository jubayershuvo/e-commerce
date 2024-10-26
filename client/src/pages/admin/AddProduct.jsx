import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const genders = [
    { value: "men", name: "Men" },
    { value: "women", name: "Women" },
    { value: "others", name: "Others" },
  ];
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    discount: "",
    availableSize: "",
  });
  const [image, setImage] = useState(null); // To hold the image file
  const [preview, setPreview] = useState(null); // For image preview
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]); // To hold multiple image files
  const [previews, setPreviews] = useState([]);
  const [genderName, setGenderName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (formData.regularPrice && formData.regularPrice > 0) {
      if (formData.discount && formData.discount > 0) {
        setPrice(
          (
            formData.regularPrice -
            (formData.regularPrice * formData.discount) / 100
          ).toFixed(2)
        );
      } else {
        setPrice(formData.regularPrice);
      }
    }
  }, [formData.discount, formData.regularPrice]);
  useEffect(() => {
    if (genderName) {
      async function fetch() {
        try {
          const res = await axios.get(`/category/${genderName}`);
          setCategories(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetch();
    }
  }, [genderName]);
  useEffect(() => {
    if (categoryName && genderName) {
      async function fetch() {
        try {
          const res = await axios.get(
            `/category/${genderName}/${categoryName}`
          );
          setSubCategories(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetch();
    }
  }, [genderName, categoryName]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Preview image
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImages(files);

    // Generate previews for selected images
    const newPreviews = files?.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // Submit form data including image to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    const addProductLoading = toast.loading("Adding product");
    try {
      const data = new FormData();
      const imagesData = new FormData();

      if (genderName) {
        if (!categoryName) {
          toast.error("Select category..!");
          return;
        } else if (subCategoryName) {
          toast.error("Select Sub-Category..!");
          return;
        }
      }

      // Append all form fields to FormData
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("regularPrice", formData.regularPrice);
      data.append("discount", formData.discount);
      data.append("availableSize", formData.availableSize);
      data.append("genderName", genderName);
      data.append("categoryName", categoryName);
      data.append("subCategoryName", subCategoryName);

      // Append single image file
      if (image) {
        data.append("productImage", image);
      }

      // Append multiple image files
      images.forEach((img) => {
        data.append(`images`, img);
      });
      for (let [key, value] of imagesData.entries()) {
        console.log(key, value); // Should print each key-value pair in FormData
      }
      // Send the FormData to the server (replace with your server URL)
      const response = await axios.post("/admin/product/add", data);
      if (response.data) {
        setFormData({
          title: "",
          description: "",
          regularPrice: "",
          discount: "",
          availableSize: "",
        });
        setImage([]);
        setImages([]);
        setPreview(null);
        setPreviews(null);
        toast.success("Product added...!", { id: addProductLoading });
      }
    } catch (error) {
      toast.error(error.response.data.message, { id: addProductLoading });
      console.error("Error uploading images:", error);
    }
  };

  return (
    <div
      className={`min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label
                htmlFor="gender"
                className="block text-sm md:text-base font-medium"
              >
                Gender
              </label>
              <select
                value={genderName} // Controlled value from state
                id="gender"
                onChange={(e) => setGenderName(e.target.value)} // Update state on change
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              >
                <option value="">Select gender</option>

                {/* Check if genders is not null/undefined and has values */}
                {genders?.length > 0 ? (
                  genders.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No gender options available</option>
                )}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="title"
                className="block text-sm md:text-base font-medium"
              >
                Category
              </label>
              <select
                disabled={!genderName ? true : false}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                id=""
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              >
                <option value="">Select Category</option>
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No gender options available</option>
                )}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="title"
                className="block text-sm md:text-base font-medium"
              >
                Sub Category
              </label>
              <select
                disabled={!categoryName ? true : false}
                name=""
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                id=""
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              >
                <option value="">Select Sub-Category</option>
                {subCategories?.length > 0 ? (
                  subCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory.name}>
                      {subCategory.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No gender options available</option>
                )}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm md:text-base font-medium"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Product title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm md:text-base font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Product description"
            ></textarea>
          </div>

          {/* Regular Price */}
          <div>
            <label
              htmlFor="regularPrice"
              className="block text-sm md:text-base font-medium"
            >
              Regular Price
            </label>
            <input
              type="number"
              id="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Regular Price"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm md:text-base font-medium"
            >
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Discount (optional)"
            />
          </div>
          <div>
            <label
              htmlFor="discount"
              className="block text-sm md:text-base font-medium"
            >
              Calculated price
            </label>
            <input
              disabled
              type="number"
              id="discount"
              value={Math.ceil(price)}
              min="0"
              max="100"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Discount (optional)"
            />
          </div>

          {/* Available Sizes */}
          <div>
            <label
              htmlFor="availableSize"
              className="block text-sm md:text-base font-medium"
            >
              Available Sizes
            </label>
            <input
              type="text"
              id="availableSize"
              value={formData.availableSize}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
              placeholder="Comma-separated sizes (e.g., S, M, L)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm md:text-base font-medium"
            >
              Product Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="otherimages"
              className="block text-sm md:text-base font-medium"
            >
              Product Images
            </label>
            <input
              type="file"
              id="otherimages"
              onChange={handleImagesChange}
              multiple // Allow multiple files
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-indigo-400"
            />
            <div className="flex mt-4 space-x-4">
              {previews?.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
