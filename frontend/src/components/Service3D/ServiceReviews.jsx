import React from "react";

const ServiceReviews = ({ reviewSummary, ratingBreakdown, reviewCards }) => {
  return (
    <section id="reviews" className="py-2">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Reviews</h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">28 reviews</h3>

            <div className="mt-4 space-y-3">
              {reviewSummary.map((item) => (
                <div key={item.label} className="grid grid-cols-[78px_1fr_auto] items-center gap-3">
                  <p
                    className={`text-base ${item.count === 0 ? "text-slate-300" : "text-slate-900"}`}
                  >
                    {item.label}
                  </p>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div
                      className={`h-3 rounded-full ${item.count === 0 ? "bg-slate-200" : "bg-slate-900"}`}
                      style={{ width: item.width }}
                    />
                  </div>
                  <p
                    className={`text-base ${item.count === 0 ? "text-slate-300" : "text-slate-900"}`}
                  >
                    ({item.count})
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Rating Breakdown</h3>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">★★★★★ 4.9</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {ratingBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">★ {item.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {reviewCards.map((review) => (
            <div key={review.name} className="rounded-[28px] border border-slate-200 p-5">
              <div className="flex flex-col gap-4 ">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0c8a43] text-2xl text-white">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">{review.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{review.country}</p>
                    </div>
                    <div className="ml-auto">
                      <img
                        src={review.image}
                        alt={`${review.name}'s project`}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-900">★★★★★ {review.rating}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{review.time}</span>
                  </div>

                  <p className="mt-3 max-w-3xl text-md leading-[1.5] text-slate-700">
                    {review.comment}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.price}</p>
                      <p className="text-xs text-slate-500">Price</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.duration}</p>
                      <p className="text-xs text-slate-500">Duration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceReviews;
