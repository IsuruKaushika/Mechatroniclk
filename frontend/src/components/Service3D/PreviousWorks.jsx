import React from "react";
import { Link } from "react-router-dom";

const PreviousWorks = ({ portfolioItems }) => {
  return (
    <section className="hidden lg:block py-14" id="previous-work">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Previous Works</h2>
          <p className="mt-2 text-sm text-slate-600">
            A few recent projects from product concept to delivery-ready visuals.
          </p>
        </div>
        <Link
          to="/contact"
          className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
        >
          Request Similar Work
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioItems.map((item) => (
          <article
            key={item.title}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                {item.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">
                High-detail model + realistic material workflow
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PreviousWorks;
