import React from "react";
import { Link } from "react-router-dom";
import Title from "../Title";

const ServiceHeadline = () => {
  return (
    <section className="mb-8 pt-8">
      <div>
        <Title text1={"Professional 3D Modeling"} text2={"& Product Designing"} />

        <p className="mt-3 text-lg text-slate-600">by MechatronicLK Studio</p>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-900">4.9</span>
          <span className="text-slate-400">★★★★★</span>
          <span className="text-slate-500">(468 reviews)</span>
        </div>
      </div>
    </section>
  );
};

export default ServiceHeadline;
