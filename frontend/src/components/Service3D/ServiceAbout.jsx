import React from "react";

const projectSteps = [
  "Share your idea, sketch, dimensions, or CAD files",
  "Get a custom response and project confirmation",
  "Receive previews, revisions, and final delivery",
];

const ServiceAbout = () => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-slate-900">About This Service</h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
        Professional 3D design for products, concepts, and engineering visuals. Suitable for
        websites, marketing, investor decks, technical presentations, and custom client work.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {projectSteps.map((step) => (
          <div key={step} className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceAbout;
