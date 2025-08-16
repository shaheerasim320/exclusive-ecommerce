// AccountLayout.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Aside from "../components/Aside";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 md:mt-28 mt-40">
        <div className="lg:w-[185px] w-full my-5 lg:mb-0">
          <Aside />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AccountLayout;
