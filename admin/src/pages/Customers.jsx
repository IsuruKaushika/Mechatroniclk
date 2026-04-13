import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const Customers = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [ordersResponse, usersResponse] = await Promise.all([
          axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } }),
          axios.get(`${backendUrl}/api/user/list`, { headers: { token } }),
        ]);

        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.orders || []);
        } else {
          toast.error(ordersResponse.data.message || "Failed to load order data");
        }

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users || []);
        } else {
          toast.error(usersResponse.data.message || "Failed to load customer data");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [token]);

  const customers = useMemo(() => {
    const customerMap = new Map();

    users.forEach((user) => {
      const email = (user.email || "").trim().toLowerCase();
      const name = (user.name || "").trim() || "Unknown Customer";
      const key = user._id || email || name;

      if (!key) return;

      customerMap.set(key, {
        id: key,
        name,
        email: user.email || "-",
        phone: "-",
        orderCount: 0,
        totalSpent: 0,
        deliveredOrders: 0,
        lastOrderDate: 0,
        hasOrdered: false,
      });
    });

    orders.forEach((order) => {
      const email = (order.address?.email || "").trim().toLowerCase();
      const phone = (order.address?.phone || "").trim();
      const fallbackId = `${order.address?.firstName || ""}-${order.address?.lastName || ""}-${phone}`;
      const key = order.userId || email || phone || fallbackId;

      if (!key) return;

      const firstName = order.address?.firstName || "";
      const lastName = order.address?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Unknown Customer";

      const existing = customerMap.get(key) || {
        id: key,
        name: fullName,
        email: order.address?.email || "-",
        phone: order.address?.phone || "-",
        orderCount: 0,
        totalSpent: 0,
        deliveredOrders: 0,
        lastOrderDate: 0,
        hasOrdered: false,
      };

      existing.name = existing.name === "Unknown Customer" ? fullName : existing.name;
      if ((!existing.email || existing.email === "-") && order.address?.email) {
        existing.email = order.address.email;
      }
      if ((!existing.phone || existing.phone === "-") && order.address?.phone) {
        existing.phone = order.address.phone;
      }
      existing.orderCount += 1;
      existing.totalSpent += Number(order.amount || 0);
      existing.hasOrdered = true;
      if (order.status === "Delivered") {
        existing.deliveredOrders += 1;
      }
      existing.lastOrderDate = Math.max(existing.lastOrderDate, Number(order.date || 0));

      customerMap.set(key, existing);
    });

    return [...customerMap.values()].sort((a, b) => {
      if (b.lastOrderDate !== a.lastOrderDate) {
        return b.lastOrderDate - a.lastOrderDate;
      }

      return a.name.localeCompare(b.name);
    });
  }, [orders, users]);

  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const baseCustomers =
      filterMode === "ordered"
        ? customers.filter((customer) => customer.hasOrdered)
        : customers;

    if (!query) return baseCustomers;

    return baseCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        String(customer.email).toLowerCase().includes(query) ||
        String(customer.phone).toLowerCase().includes(query),
    );
  }, [customers, filterMode, searchTerm]);

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const orderedCustomersCount = customers.filter((customer) => customer.hasOrdered).length;

  if (loading) {
    return <div className="py-6 text-gray-600">Loading customer data...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
        </div>
        <div className="text-sm text-gray-600">
          {customers.length} customers | {orderedCustomersCount} ordered | {currency}
          {Math.round(totalRevenue).toLocaleString()} total order value
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email or phone"
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
        />

        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
        >
          <option value="all">All Customers</option>
          <option value="ordered">Ordered Customers</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Orders</th>
              <th className="px-4 py-3 text-left font-medium">Delivered</th>
              <th className="px-4 py-3 text-left font-medium">Total Spent</th>
              <th className="px-4 py-3 text-left font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-800 font-medium">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                <td className="px-4 py-3 text-gray-700">{customer.orderCount}</td>
                <td className="px-4 py-3 text-gray-700">{customer.deliveredOrders}</td>
                <td className="px-4 py-3 text-gray-700">
                  {currency}
                  {Math.round(customer.totalSpent).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {customer.lastOrderDate
                    ? new Date(customer.lastOrderDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border border-gray-200 bg-white rounded-lg">
          No customers found for the current filter.
        </div>
      )}
    </div>
  );
};

export default Customers;
