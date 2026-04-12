import React from "react";

const renderCell = (value) => {
  if (value === "check") {
    return <span className="text-lg font-semibold text-slate-900">✓</span>;
  }

  if (value === "muted") {
    return <span className="text-lg font-semibold text-slate-300">✓</span>;
  }

  return <span className="text-sm text-slate-700">{value}</span>;
};

const ComparePackages = ({ comparisonRows }) => {
  return (
    <section id="compare-packages" className="py-10">
      <h2 className="text-2xl font-semibold text-slate-900">Compare packages</h2>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 align-top">
                <th className="w-[180px] border-r border-slate-200 px-4 py-5 text-left text-sm font-normal text-slate-500">
                  Package
                </th>
                <th className="border-r border-slate-200 px-4 py-5 text-left">
                  <p className="text-2xl font-semibold text-slate-900">US$40</p>
                  <p className="mt-2 text-base font-semibold text-slate-700">Basic</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Basic
                  </p>
                  <p className="mt-2 max-w-[160px] text-left text-xs leading-5 text-slate-600">
                    Simple model with rendering
                  </p>
                </th>
                <th className="border-r border-slate-200 px-4 py-5 text-left">
                  <p className="text-2xl font-semibold text-slate-900">US$100</p>
                  <p className="mt-2 text-base font-semibold text-slate-700">Standard</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Standard
                  </p>
                  <p className="mt-2 max-w-[160px] text-left text-xs leading-5 text-slate-600">
                    Detailed model with rendering
                  </p>
                </th>
                <th className="px-4 py-5 text-left">
                  <p className="text-2xl font-semibold text-slate-900">US$180</p>
                  <p className="mt-2 text-base font-semibold text-slate-700">Premium</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Premium
                  </p>
                  <p className="mt-2 max-w-[190px] text-left text-xs leading-5 text-slate-600">
                    Complex model with realistic rendering and drawings
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.label} className={index % 2 === 0 ? "bg-slate-50/70" : "bg-white"}>
                  <td className="border-r border-t border-slate-200 px-4 py-4 text-left text-sm text-slate-700">
                    {row.label}
                  </td>
                  <td className="border-r border-t border-slate-200 px-4 py-4 text-center">
                    {renderCell(row.basic)}
                  </td>
                  <td className="border-r border-t border-slate-200 px-4 py-4 text-center">
                    {renderCell(row.standard)}
                  </td>
                  <td className="border-t border-slate-200 px-4 py-4 text-center">
                    {renderCell(row.premium)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparePackages;
