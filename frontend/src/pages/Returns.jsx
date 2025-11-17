import React, { useState } from 'react';

const Returns = () => {
  const [expandedSections, setExpandedSections] = useState({
    returns: true,
    refunds: false,
    exchanges: false,
    nonReturnable: false,
    damaged: false,
    shipping: false,
    processing: false,
    contact: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const Section = ({ id, title, children }) => (
    <div className="mb-8 pb-4 border-b border-gray-300">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => toggleSection(id)}
      >
        <h2 className="prata-regular text-xl text-[#414141]">{title}</h2>
        <div className="text-[#414141] text-lg">
          {expandedSections[id] ? '−' : '+'}
        </div>
      </div>
      {expandedSections[id] && (
        <div className="mt-4 text-[#414141] space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row border-b border-gray-300 pb-10 mb-10">
        <div className="w-full flex items-center justify-center py-10">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="font-medium text-sm md:text-base">HELP & SUPPORT</p>
            </div>
            <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
              Return & Refund Policy
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">LAST UPDATED: November 17, 2025</p>
              <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* 1. Returns */}
        <Section id="returns" title="1. Returns">
          <p>We accept returns within <strong>7 days</strong> of your purchase date. Returned electronic items must be unused, in original condition, and include <strong>all accessories, cables, manuals, warranty cards, and original packaging</strong>.</p>
          <p>Items showing signs of installation, tampering, or physical damage caused by misuse will not be eligible for return.</p>
        </Section>

        {/* 2. Refunds */}
        <Section id="refunds" title="2. Refunds">
          <p>After your returned item is received and inspected, we will notify you of your refund approval status. If approved, refunds will be issued to your <strong>original payment method</strong>.</p>
          <p>Refunds exclude:</p>
          <ul className="list-disc pl-5">
            <li>Initial shipping costs</li>
            <li>Installation or configuration fees (if applicable)</li>
          </ul>
        </Section>

        {/* 3. Exchanges */}
        <Section id="exchanges" title="3. Exchanges">
          <p>If you received a <strong>wrong item, wrong model, wrong specification, or a defective product</strong>, please contact our support team within <strong>3 days</strong> of receiving your order.</p>
          <p>We will guide you through testing and the exchange process.</p>
        </Section>

        {/* 4. Non-Returnable Items */}
        <Section id="nonReturnable" title="4. Non-Returnable Items">
          <ul className="list-disc pl-5 space-y-1">
            <li>Software, license keys, activation codes</li>
            <li>Earphones, earbuds, or headphones (hygiene rules)</li>
            <li>Opened microcontrollers, modules, ICs, and sensors</li>
            <li>Products with missing accessories or broken seals</li>
            <li>Items damaged due to incorrect wiring or improper use</li>
          </ul>
        </Section>

        {/* 5. Damaged or Defective Items */}
        <Section id="damaged" title="5. Damaged or Defective Items">
          <p>If your product arrives damaged, defective, or dead on arrival (DOA), contact us within <strong>48 hours</strong> with photos or videos for verification.</p>
          <p>After review, we may offer:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A replacement unit</li>
            <li>Store credit</li>
            <li>A full or partial refund</li>
          </ul>
          <p>Damage caused by incorrect wiring, soldering, modification, or mishandling is <strong>not covered</strong>.</p>
        </Section>

        {/* 6. Return Shipping */}
        <Section id="shipping" title="6. Return Shipping">
          <p>Customers must cover return shipping costs unless:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You received the wrong item</li>
            <li>The item was defective or DOA</li>
            <li>The issue was due to our mistake</li>
          </ul>
          <p>If eligible, we will provide a prepaid return label.</p>
        </Section>

        {/* 7. Processing Time */}
        <Section id="processing" title="7. Processing Time">
          <p>Returns, exchanges, and refunds are processed within <strong>3–7 business days</strong> after we receive the returned item.</p>
          <p>Refund clearance times may vary depending on your bank or payment provider.</p>
        </Section>

        {/* 8. Contact */}
        <Section id="contact" title="8. Contact Us">
          <p>If you need help with a return, exchange, or warranty claim, our support team is available:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Email: mechatroniclk@gmail.com</li>
            <li>Phone: +94 72 615 1400</li>
            <li>Live Chat: Available on our website during business hours</li>
          </ul>
        </Section>

      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col items-center">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2 justify-center">
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">© 2025 OGEE ERA</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
          <p className="text-center text-sm mt-2">All rights reserved.</p>
        </div>
      </div>
      
    </div>
  );
};

export default Returns;
