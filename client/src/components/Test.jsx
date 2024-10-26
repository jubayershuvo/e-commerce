import React, { useState } from "react";

function CategoryPage() {
  const [darkMode, setDarkMode] = useState(false);

  // State for categories and subcategories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // State for form inputs
  const [categoryName, setCategoryName] = useState("");
  const [categoryGender, setCategoryGender] = useState("Male");

  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryGender, setSubCategoryGender] = useState("Male");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle category creation
  const handleCreateCategory = () => {
    setCategories([
      ...categories,
      { name: categoryName, gender: categoryGender },
    ]);
    setCategoryName("");
  };

  // Handle subcategory creation
  const handleCreateSubCategory = () => {
    setSubCategories([
      ...subCategories,
      {
        name: subCategoryName,
        gender: subCategoryGender,
        category: selectedCategory,
      },
    ]);
    setSubCategoryName("");
    setSelectedCategory("");
  };

  // Handle deleting category
  const handleDeleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  // Handle deleting subcategory
  const handleDeleteSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto p-4">
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-800 text-white dark:bg-gray-300 dark:text-black rounded"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Create Category</h2>
          <div className="mb-4">
            <label className="block mb-2">Category Name: </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Gender: </label>
            <select
              value={categoryGender}
              onChange={(e) => setCategoryGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            onClick={handleCreateCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Category
          </button>

          <h2 className="text-2xl font-bold mt-8 mb-4">Create SubCategory</h2>
          <div className="mb-4">
            <label className="block mb-2">SubCategory Name: </label>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category: </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Gender: </label>
            <select
              value={subCategoryGender}
              onChange={(e) => setSubCategoryGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            onClick={handleCreateSubCategory}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Create SubCategory
          </button>

          <h2 className="text-2xl font-bold mt-8 mb-4">Category List</h2>
          <ul className="list-disc pl-5">
            {categories.map((category, index) => (
              <li key={index} className="mb-2">
                {category.name} ({category.gender})
                <button
                  onClick={() => handleDeleteCategory(index)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">SubCategory List</h2>
          <ul className="list-disc pl-5">
            {subCategories.map((subCategory, index) => (
              <li key={index} className="mb-2">
                {subCategory.name} ({subCategory.gender}) in{" "}
                {subCategory.category}
                <button
                  onClick={() => handleDeleteSubCategory(index)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
