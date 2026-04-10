import React from "react";
import { NavLink } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { LuLayoutDashboard, LuPackageSearch } from "react-icons/lu";
import { LuPackageOpen } from "react-icons/lu";
import { GiBoxUnpacking } from "react-icons/gi";
import { FiPlusCircle } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/"
        >
          <LuLayoutDashboard className="w-5 h-5" />
          <p className="hidden md:block">Dashboard</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <FiPlusCircle className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <LuPackageSearch className="w-5 h-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/customers"
        >
          <FiUsers className="w-5 h-5" />
          <p className="hidden md:block">Customers</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/PlacedOrders"
        >
          <LuPackageOpen className="w-5 h-5" />
          <p className="hidden md:block">Placed Orders</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/PackingOrders"
        >
          <GiBoxUnpacking className="w-5 h-5" />
          <p className="hidden md:block">Packing Orders</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/DeliveredOrders"
        >
          <FiCheckCircle className="w-5 h-5" />
          <p className="hidden md:block">Delivered Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
