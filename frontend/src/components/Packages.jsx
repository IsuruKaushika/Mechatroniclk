export const Packages = () => {
  return (
    <div className="lg:sticky lg:top-32 lg:h-fit">
      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Package Tabs */}
        <div className="flex border-b border-slate-200">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                selectedPackage === pkg.id
                  ? "border-b-2 border-slate-900 text-slate-900 bg-white"
                  : "text-slate-500 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              {pkg.label}
            </button>
          ))}
        </div>

        {/* Package Details */}
        <div className="p-6">
          {(() => {
            const pkg = packages.find((p) => p.id === selectedPackage);
            return (
              <>
                {/* Price Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {pkg.label}
                      </p>
                      <h2 className="mt-2 text-4xl font-semibold text-slate-900">US${pkg.price}</h2>
                    </div>
                    {pkg.mostPopular && (
                      <p className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">
                        Most Popular
                      </p>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{pkg.description}</p>
                </div>

                {/* Delivery Info */}
                <div className="mb-6 flex gap-6 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900">⏱ {pkg.delivery}-day delivery</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">✏ {pkg.revisions} revisions</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-3 text-sm text-slate-700">
                  {pkg.features.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          feature.included ? "text-slate-900" : "text-slate-300"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={feature.included ? "text-slate-900" : "text-slate-400"}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Request to order
                  </button>
                  <button className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                    Contact me
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
