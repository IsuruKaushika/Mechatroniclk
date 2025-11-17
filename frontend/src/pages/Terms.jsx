import React, { useState } from 'react';

const Terms = () => {
  const [expandedSections, setExpandedSections] = useState({
    terms: true,
    product: false,
    order: false,
    risk: false,
    payment: false,
    warranty: false,
    indemnification: false,
    force: false,
    website: false,
    intellectual: false,
    information: false,
    viruses: false,
    jurisdiction: false
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row border-b border-gray-300 pb-10 mb-10">
        <div className="w-full flex items-center justify-center py-10">
          <div className="text-[#414141]">
            <div className="flex items-center gap-2">
              <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
              <p className="font-medium text-sm md:text-base">LEGAL INFORMATION</p>
            </div>
            <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Terms & Conditions</h1>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">LAST UPDATED: November 17, 2025</p>
              <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        
        {/* Terms of Use */}
        <Section id="terms" title="1. Terms of Use">
          <p>By accessing this Website and/or using our e-commerce service (“Service”), you agree to comply with these Terms and all policies/notices on the Website.</p>
          <p className="mt-2">If you disagree with any part of these Terms, you must stop using the Website immediately. MechatronicLK may update or modify these Terms at any time, and you are responsible for reviewing them regularly.</p>
          <h3 className="font-semibold mt-6 mb-2 text-[#414141]">General Conditions</h3>
          <p>We reserve the right to refuse service to anyone for any reason. Prices, stock availability, and product details may change without notice. We may discontinue any product at any time.</p>
        </Section>

        {/* Product Information */}
        <Section id="product" title="2. Product Information">
          <p>All electronic components, modules, tools, and accessories displayed on the Website are subject to availability. If an item is unavailable after ordering, we will notify you and issue a refund.</p>
          <p className="mt-2">Products shown online may not always be available in physical stock. MechatronicLK does not guarantee availability at all times.</p>
          <p className="mt-2">Images are for illustration only. The actual product may vary slightly due to manufacturer updates or color differences.</p>
          <p className="mt-2">Electronic components require proper handling. Damage caused by incorrect usage, improper wiring, reverse polarity, overvoltage, overheating, or poor soldering does not qualify as a manufacturing defect and is not covered under warranty.</p>
        </Section>

        {/* Placing an Order */}
        <Section id="order" title="3. Placing an Order">
          <p>To place an order, add items to your cart and proceed to checkout. You may checkout as a guest or create an account.</p>
          <p className="mt-2">You are responsible for maintaining the confidentiality of your account details. Notify us immediately of any unauthorized account use.</p>
          <p className="mt-2">An order is considered accepted only when payment is completed and dispatch confirmation is issued.</p>
        </Section>

        {/* Risk and Title */}
        <Section id="risk" title="4. Risk and Title">
          <p>Ownership and responsibility for the products transfer to you upon delivery. For returns or exchanges, responsibility transfers back to us only after we receive the item.</p>
        </Section>

        {/* Price and Payment */}
        <Section id="payment" title="5. Price and Payment">
          <p>Payment can be made via the methods displayed on our Website. All payments are processed securely through third-party payment processors.</p>
          <p className="mt-2">We are not responsible for payment processor errors or third-party unauthorized access during payment submission.</p>
          <p className="mt-2">Prices may change without notice, but changes will not affect already paid orders.</p>
        </Section>

        {/* Warranty and Liability */}
        <Section id="warranty" title="6. Warranties; Limitation of Liability">
          <p>All products are sold “as is” unless a specific warranty is stated. Electronic components require correct usage and handling.</p>
          <p className="mt-2">MechatronicLK is not liable for damages caused by improper installation, short circuits, incorrect voltage, misuse, or modifications.</p>
          <p className="mt-2">Your use of the Website and products is at your own risk. We are not responsible for indirect or consequential damages.</p>
        </Section>

        {/* Indemnification */}
        <Section id="indemnification" title="7. Indemnification">
          <p>You agree to indemnify and hold MechatronicLK and its affiliates harmless from any claims arising from your misuse of the Website or violation of these Terms.</p>
        </Section>

        {/* Force Majeure */}
        <Section id="force" title="8. Force Majeure">
          <p>We are not liable for delays or failure to fulfill obligations caused by events beyond our control, such as natural disasters, transportation issues, or technical failures.</p>
        </Section>

        {/* Website Use */}
        <Section id="website" title="9. Website Terms of Use">
          <p>The Website may be temporarily unavailable from time to time. We do not guarantee uninterrupted access.</p>
        </Section>

        {/* Intellectual Property */}
        <Section id="intellectual" title="10. Intellectual Property">
          <p>All Website content, including images, product descriptions, and branding, belongs to MechatronicLK and is protected by copyright laws.</p>
        </Section>

        {/* Privacy */}
        <Section id="information" title="11. Information About You and Your Website Visits">
          <p>Your information is managed according to our Privacy Policy.</p>
        </Section>

        {/* Viruses and Misuse */}
        <Section id="viruses" title="12. Viruses, Hacking, and Related Offenses">
          <p>Unauthorized attempts to access the Website, servers, or databases are prohibited. You are responsible for protecting your devices from malware.</p>
        </Section>

        {/* Jurisdiction */}
        <Section id="jurisdiction" title="13. Jurisdiction and Governing Law">
          <p>All disputes are governed by Sri Lankan law and fall under the jurisdiction of Sri Lankan courts.</p>
        </Section>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col items-center">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2 justify-center">
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">© 2025 MECHATRONICLK</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
          <p className="text-center text-sm mt-2">All rights reserved.</p>
        </div>
      </div>

    </div>
  );
};

export default Terms;
