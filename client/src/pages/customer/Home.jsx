import React, { useEffect, useState } from "react";
import MainCarousel from "../../components/MainCarousel";
import ProductCarosel from "../../components/ProductCarousel";
import axios from "axios";

function Home() {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);

  const banners = [
    {
      title: "Banner 1",
      imageUrl:
        "https://img.freepik.com/free-vector/yellow-black-friday-big-deal-banner-with-3d-podium-platform_1017-41265.jpg?w=996&t=st=1728291941~exp=1728292541~hmac=1dbac07bce0debcd31795f8b67d1517f762468f885ecf6e685b75ede92dd6e3d",
    },
    {
      title: "Banner 2",
      imageUrl:
        "https://img.freepik.com/free-vector/modern-sale-banner-with-product_1361-1636.jpg?w=996&t=st=1728292074~exp=1728292674~hmac=f12020eaf6dc1365660bf18eec98ee21b776a552355720549bfa367c9f822d99",
    },
    {
      title: "Banner 3",
      imageUrl:
        "https://img.freepik.com/premium-vector/product-sale-promotion-cover-banner-template-design_1033790-7399.jpg?w=996",
    },
    {
      title: "Banner 4",
      imageUrl:
        "https://img.freepik.com/free-vector/luxury-headphone-brand-product-sale-facebook-cover-template_4513-539.jpg?w=996&t=st=1728293744~exp=1728294344~hmac=013ddfb67daab9dbfc1e0739e6bc301d6e09f9a8ee28b46dfc6689421355af4a",
    },
    {
      title: "Banner 5",
      imageUrl:
        "https://as2.ftcdn.net/v2/jpg/04/62/25/91/1000_F_462259136_ieLHu3BL11q66HMrKFTtzleU8QPPmEOT.jpg",
    },
  ];
  useEffect(() => {
    async function fetch() {
      try {
        // Submit the data if validation passed
        const response = await axios.get("/product/gender/men");

        if (response?.data?.data) {
          setMenProducts(response.data.data);
        }
      } catch (error) {
        console.log("Error during address submission: ", error);
      }
    }
    fetch();
  }, []);
  useEffect(() => {
    async function fetch() {
      try {
        // Submit the data if validation passed
        const response = await axios.get("/product/gender/women");

        if (response?.data?.data) {
          setWomenProducts(response.data.data);
        }
      } catch (error) {
        console.log("Error during address submission: ", error);
      }
    }
    fetch();
  }, []);
  return (
    <div className="bg-white custom-scrollbar dark:bg-gray-800 min-h-screen dark:text-white">
      <div className="pb-5 m-auto">
        <div className="mx-4">
          <MainCarousel banners={banners} />
        </div>
        <div className="m-2 min-h-60">
          <h1 className="ml-4 font-extrabold">For Men's</h1>
          {menProducts.length > 0 ? (
            <ProductCarosel items={menProducts} />
          ) : (
            <p className="mt-10 ml-10">No products</p>
          )}
        </div>
        <div className="m-2">
          <h1 className="ml-4 font-extrabold">For Women's</h1>
          {womenProducts.length > 0 ? (
            <ProductCarosel items={womenProducts} />
          ) : (
            <p className="mt-10 ml-10">No products</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
