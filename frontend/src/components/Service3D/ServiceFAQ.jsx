import React, { useState } from "react";

const faqs = [
  {
    question: "What do you need to start?",
    answer:
      "A sketch, reference images, measurements, a CAD export, or even a short concept description is enough.",
  },
  {
    question: "Can I request a custom offer?",
    answer:
      "Yes. Larger or more technical projects can be discussed through contact or the chat area.",
  },
  {
    question: "Will the realtime chat work now?",
    answer:
      "The chat panel is already placed in the layout and can be connected to a realtime backend next.",
  },
];

const ServiceFAQ = () => {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>

      <div className="mt-6 space-y-4">
        {faqs.map((item, index) => (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <button
              type="button"
              onClick={() => setActiveFaq(index === activeFaq ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              <span className="text-xl text-slate-500">{activeFaq === index ? "−" : "+"}</span>
            </button>
            {activeFaq === index && (
              <p className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFAQ;
