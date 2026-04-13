import React from "react";
import { Link } from "react-router-dom";

const ServiceCustomOffer = () => {
  return (
    <div className="rounded-[28px] bg-slate-900 p-6 text-white shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold">Need a custom 3D design offer?</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
        Start with a message, request a direct order, or discuss a larger custom project before
        purchase.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/contact"
          className="rounded-md bg-[#1dbf73] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#19a463]"
        >
          Contact Me
        </Link>
        <button className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          Request To Order
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          Realtime Chat
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          Chat directly with the seller. Real-time messaging, file uploads, and instant
          notifications. Use the floating chat button at the bottom right to start messaging!
        </p>
      </div>
    </div>
  );
};

export default ServiceCustomOffer;
