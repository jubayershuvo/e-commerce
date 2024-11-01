import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast'

function CategoryPage() {
  const [storedCategory, setStoredCategory] = useState([]);
  const [storedSubCategory, setStoredSubCategory] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoryGender, setCategoryGender] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryGender, setSubCategoryGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetch() {
      try {
        const allCategory = await axios.get("/category/allcategory");
        setStoredCategory(allCategory.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);
  useEffect(() => {
    async function fetch() {
      try {
        const allSubCategory = await axios.get("/category/allsubcategory");
        setStoredSubCategory(allSubCategory.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    if (subCategoryGender) {
      async function fetch() {
        try {
          const res = await axios.get(`/category/${subCategoryGender}`);
          setCategories(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetch();
    }
  }, [subCategoryGender]);

  // State for form inputs

  // Handle category creation
  const handleCreateCategory = async() => {
    if(!categoryGender){
      toast.error("Select gender..!")
      return
    }
    if(categoryName && categoryGender){
      console.log(categoryName, categoryGender)
      const loading = toast.loading("Creating category...!")
      try {
      const res = await axios.post('/category/add',{
        name: categoryName,
        genderName: categoryGender
      });
      setStoredCategory(res.data.data)
      toast.success("Category added..!",{id:loading})
      setCategoryName('')
      } catch (error) {
        toast.error(error.response.message, {id: loading})
        console.log(error)
      }
    }
  };

  // Handle subcategory creation
  const handleCreateSubCategory = async() => {
    if(!subCategoryGender){
      toast.error("Select gender..!")
      return
    }
    if(!selectedCategory){
      toast.error("Select category..!")
      return
    }
    if(subCategoryName && subCategoryGender && selectedCategory){
      const loading = toast.loading("Creating sub-category...!")
      try {
      const res = await axios.post('/category/sub/add',{
        name: subCategoryName,
        genderName: subCategoryGender,
        categoryName: selectedCategory
      });
      setStoredSubCategory(res.data.data)
      toast.success("Sub-Category added..!",{id:loading})
      setCategoryName('')
      } catch (error) {
        toast.error(error.response.message, {id: loading})

      }
    }
  };

  // Handle deleting category
  const handleDeleteCategory = async(id) => {
    const loading = toast.loading("Category deleting..!")
    try {
      const res = await axios.get(`/category/delete/${id}`);
      setStoredCategory(res.data.data)
      toast.success("Category deleted..!",{id: loading})
    } catch (error) {
      toast.error(error.response.message, {id: loading})
    }
  };

  // Handle deleting subcategory
  const handleDeleteSubCategory = async(id) => {
    const loading = toast.loading("Category deleting..!")
    try {
      const res = await axios.get(`/category/sub/delete/${id}`)
      setStoredSubCategory(res.data.data)
      toast.success("Sub-Category deleted..!",{id: loading})
    } catch (error) {
      toast.error(error.response.message, {id: loading})
    }
  };

  return (
    <div className="">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Create Category</h2>
          <div className="mb-4">
            <label className="block mb-2">Gender: </label>
            <select
              value={categoryGender}
              onChange={(e) => setCategoryGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category Name: </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            onClick={handleCreateCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Category
          </button>

          <h2 className="text-2xl font-bold mt-8 mb-4">Create SubCategory</h2>

          <div className="mb-4">
            <label className="block mb-2">Gender: </label>
            <select
              value={subCategoryGender}
              onChange={(e) => setSubCategoryGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category: </label>
            <select
              disabled={subCategoryGender ? false : true}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.value}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">SubCategory Name: </label>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            onClick={handleCreateSubCategory}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Create SubCategory
          </button>

          <h2 className="text-2xl font-bold mt-8 mb-4">Category List</h2>
          <ul className="list-disc pl-5">
            {storedCategory?.map((category, index) => (
              <li key={index} className="mb-2">
                {category.name} ({category.gender.name})
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">SubCategory List</h2>
          <ul className="list-disc pl-5">
            {storedSubCategory.map((subCategory, index) => (
              <li key={index} className="mb-2">
                {subCategory.name} ({subCategory.category.gender.name}) in{" "}
                {subCategory.category.name}
                <button
                  onClick={() => handleDeleteSubCategory(subCategory._id)}
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
