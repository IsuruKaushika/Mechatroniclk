import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const SALES_RANGE_OPTIONS = [
  { value: "week", label: "Last Week" },
  { value: "month", label: "Last Month" },
  { value: "threeMonths", label: "Last 3 Months" },
  { value: "all", label: "All Time" },
];

const formatDayLabel = (timestamp) =>
  new Date(timestamp).toLocaleDateString("en-US", { day: "2-digit", month: "short" });

const formatMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

const getStartOfDay = (timestamp) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDeliveredOrders = (orders) => orders.filter((order) => order.status === "Delivered");

const buildSalesSeries = (orders, range) => {
  const deliveredOrders = getDeliveredOrders(orders);
  const now = new Date();
  const today = getStartOfDay(now.getTime());

  if (range === "all") {
    if (deliveredOrders.length === 0) {
      return [{ label: formatMonthLabel(today), amount: 0 }];
    }

    const firstOrderDate = getStartOfDay(
      Math.min(...deliveredOrders.map((order) => Number(order.date || 0))),
    );

    const monthlySeries = [];
    const cursor = new Date(firstOrderDate.getFullYear(), firstOrderDate.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    while (cursor <= endMonth) {
      const start = cursor.getTime();
      const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1).getTime();
      const amount = deliveredOrders
        .filter((order) => order.date >= start && order.date < next)
        .reduce((sum, order) => sum + Number(order.amount || 0), 0);

      monthlySeries.push({
        label: formatMonthLabel(cursor),
        amount,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return monthlySeries;
  }

  let days = 7;
  if (range === "month") days = 30;
  if (range === "threeMonths") days = 90;

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (days - 1 - index));

    const start = day.getTime();
    const end = start + 24 * 60 * 60 * 1000;
    const amount = deliveredOrders
      .filter((order) => order.date >= start && order.date < end)
      .reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return {
      label: formatDayLabel(start),
      amount,
    };
  });
};

const buildLinePoints = (series, width, height, padding) => {
  if (series.length <= 1) {
    const x = padding;
    const y = height - padding;
    return `${x},${y}`;
  }

  const maxAmount = Math.max(...series.map((point) => point.amount), 1);
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return series
    .map((point, index) => {
      const x = padding + (index / (series.length - 1)) * chartWidth;
      const y = padding + (1 - point.amount / maxAmount) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
};

const Home = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesRange, setSalesRange] = useState("all");

  useEffect(() => {
    const fetchOverview = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const [productResponse, orderResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/product/list`),
          axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } }),
        ]);

        if (productResponse.data.success) {
          setProducts(productResponse.data.products || []);
        } else {
          toast.error(productResponse.data.message || "Failed to load products");
        }

        if (orderResponse.data.success) {
          setOrders(orderResponse.data.orders || []);
        } else {
          toast.error(orderResponse.data.message || "Failed to load orders");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [token]);

  const overview = useMemo(() => {
    const totalProducts = products.length;
    const inStockCount = products.filter((item) => item.stockStatus === "In Stock").length;
    const limitedStockCount = products.filter(
      (item) => item.stockStatus === "Limited Stock",
    ).length;
    const outOfStockCount = products.filter((item) => item.stockStatus === "Out of Stock").length;

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
    const cancelledOrders = orders.filter((order) => order.status === "Cancelled").length;

    const totalSales = getDeliveredOrders(orders).reduce(
      (sum, order) => sum + Number(order.amount || 0),
      0,
    );

    const salesSeries = buildSalesSeries(orders, salesRange);
    const selectedRangeSales = salesSeries.reduce((sum, day) => sum + day.amount, 0);
    const maxRangeSale = Math.max(...salesSeries.map((item) => item.amount), 1);

    const trendingMap = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item._id || item.name;
        if (!key) return;

        const quantity = Number(item.quantity || 0);
        const revenue = Number(item.price || 0) * quantity;
        const existing = trendingMap.get(key) || {
          key,
          name: item.name || "Unnamed Product",
          image: item.image?.[0] || "",
          quantity: 0,
          revenue: 0,
        };

        existing.quantity += quantity;
        existing.revenue += revenue;
        if (!existing.image && item.image?.[0]) {
          existing.image = item.image[0];
        }

        trendingMap.set(key, existing);
      });
    });

    const trendingProducts = [...trendingMap.values()]
      .sort((a, b) => {
        if (b.quantity !== a.quantity) return b.quantity - a.quantity;
        return b.revenue - a.revenue;
      })
      .slice(0, 4);

    return {
      totalProducts,
      inStockCount,
      limitedStockCount,
      outOfStockCount,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales,
      salesSeries,
      selectedRangeSales,
      maxRangeSale,
      trendingProducts,
    };
  }, [orders, products, salesRange]);

  const chartHeight = 260;
  const chartWidth = 900;
  const chartPadding = 24;
  const linePoints = buildLinePoints(overview.salesSeries, chartWidth, chartHeight, chartPadding);
  const yAxisValues = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    Math.round(overview.maxRangeSale * ratio),
  );
  const xLabelGap = Math.max(1, Math.ceil(overview.salesSeries.length / 8));

  if (loading) {
    return <div className="py-6 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Admin Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Sales (Delivered)</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {currency}
            {overview.totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{overview.totalOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Delivered Orders</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{overview.deliveredOrders}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{overview.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-base font-semibold text-gray-800">Sales Trend</h2>
            <p className="text-xs text-gray-500">Delivered orders only</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {SALES_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSalesRange(option.value)}
                className={`px-3 py-1.5 text-xs border rounded ${
                  salesRange === option.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500">Selected Range Sales</p>
            <p className="text-xl font-semibold text-gray-900">
              {currency}
              {overview.selectedRangeSales.toLocaleString()}
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="h-64 relative border border-gray-200 rounded bg-white">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                  {yAxisValues.map((value, index) => {
                    const y =
                      chartPadding +
                      (index / (yAxisValues.length - 1)) * (chartHeight - chartPadding * 2);
                    return (
                      <g key={`y-axis-${value}-${index}`}>
                        <line
                          x1={chartPadding}
                          y1={y}
                          x2={chartWidth - chartPadding}
                          y2={y}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <text x={6} y={y + 4} fontSize="10" fill="#6b7280">
                          {currency}
                          {value.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}

                  <polyline fill="none" stroke="#111827" strokeWidth="2.5" points={linePoints} />

                  {overview.salesSeries.map((point, index) => {
                    const maxAmount = Math.max(
                      ...overview.salesSeries.map((item) => item.amount),
                      1,
                    );
                    const x =
                      chartPadding +
                      (overview.salesSeries.length <= 1
                        ? 0
                        : (index / (overview.salesSeries.length - 1)) *
                          (chartWidth - chartPadding * 2));
                    const y =
                      chartPadding +
                      (1 - point.amount / maxAmount) * (chartHeight - chartPadding * 2);

                    return (
                      <circle key={`${point.label}-${index}`} cx={x} cy={y} r="3" fill="#111827" />
                    );
                  })}
                </svg>
              </div>

              <div className="flex justify-between text-[11px] text-gray-500 mt-2 px-1">
                {overview.salesSeries.map((point, index) => {
                  const showLabel =
                    index === 0 ||
                    index === overview.salesSeries.length - 1 ||
                    index % xLabelGap === 0;

                  return (
                    <span key={`${point.label}-x-${index}`} className="w-full text-center truncate">
                      {showLabel ? point.label : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Stock Health</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">In Stock</p>
                <p className="font-medium text-gray-900">{overview.inStockCount}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Limited Stock</p>
                <p className="font-medium text-gray-900">{overview.limitedStockCount}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Out of Stock</p>
                <p className="font-medium text-gray-900">{overview.outOfStockCount}</p>
              </div>
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <p className="text-gray-600">Cancelled Orders</p>
                <p className="font-medium text-gray-900">{overview.cancelledOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Trending Products</h2>
              <p className="text-xs text-gray-500">By total ordered quantity</p>
            </div>

            {overview.trendingProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No product order data yet.</p>
            ) : (
              <div className="space-y-3">
                {overview.trendingProducts.map((product, index) => (
                  <div key={product.key || `product-${index}`} className="flex items-center gap-3">
                    <p className="w-5 text-xs text-gray-500">{index + 1}</p>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 border border-gray-200" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {product.quantity} | {currency}
                        {Math.round(product.revenue).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
