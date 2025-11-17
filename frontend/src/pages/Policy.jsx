import React, { useState } from 'react';

const Policy = () => {
  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    information: false,
    use: false,
    sharing: false,
    security: false,
    cookies: false,
    changes: false,
    contact: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
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
        <div className="mt-4 text-[#414141] space-y-3">{children}</div>
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
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm md:text-base">
                LAST UPDATED: November 17, 2025
              </p>
              <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {/* 1. Overview */}
        <Section id="intro" title="1. Overview">
          <p>
            At <strong>mechatronic.lk</strong>, your privacy is our top priority.
            This Privacy Policy explains how we collect, use, and protect your
            information when you shop for electronic components, sensors,
            modules, tools, and other engineering products on our website.
          </p>
          <p>
            By accessing or using our services, you agree to the terms of this
            Privacy Policy.
          </p>
        </Section>

        {/* 2. Information We Collect */}
        <Section id="information" title="2. Information We Collect">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Personal details:</strong> Name, email, phone number,
              delivery address (used for order processing and shipping).
            </li>
            <li>
              <strong>Payment information:</strong> Billing details and payment
              method data. (All payments are handled securely by trusted
              third-party providers. We do not store your card details.)
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser type, device
              information, and activity logs collected through cookies and
              analytics tools.
            </li>
            <li>
              <strong>Order history:</strong> Products purchased, warranty
              claims, return requests, and customer support communication.
            </li>
          </ul>
        </Section>

        {/* 3. How We Use Your Information */}
        <Section id="use" title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>To process orders, arrange delivery, and verify payments.</li>
            <li>
              To provide technical support related to electronic components,
              modules, and devices.
            </li>
            <li>
              To recommend products, promotions, or restocks based on your
              interests.
            </li>
            <li>
              To enhance site performance, security, and customer experience.
            </li>
            <li>
              To detect fraudulent transactions and protect against misuse of
              high-value electronic items.
            </li>
          </ul>
        </Section>

        {/* 4. Information Sharing */}
        <Section id="sharing" title="4. Information Sharing">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              We <strong>do not sell, rent, or trade</strong> your personal
              information.
            </li>
            <li>
              <strong>Logistics partners:</strong> Shipping carriers receive
              your delivery details to deliver your electronics safely.
            </li>
            <li>
              <strong>Payment processors:</strong> Banks and verified payment
              gateways handle your payment data securely.
            </li>
            <li>
              <strong>Service providers:</strong> Analytics and marketing tools
              may access limited data to help improve the customer experience.
            </li>
            <li>
              <strong>Legal requirements:</strong> We may share information if
              requested by law enforcement or required by legal process.
            </li>
          </ul>
        </Section>

        {/* 5. Data Security */}
        <Section id="security" title="5. Data Security">
          <p>
            We implement industry-standard encryption, secure servers, and
            monitoring tools to protect your information. While we take strong
            precautions, no online platform can guarantee 100% security.
          </p>
        </Section>

        {/* 6. Cookies & Tracking */}
        <Section id="cookies" title="6. Cookies & Tracking Technologies">
          <p>
            We use cookies to store preferences, improve site performance,
            analyze product demand (such as popular sensors, microcontrollers,
            and modules), and enhance your overall shopping experience.
          </p>
          <p>
            You may disable cookies through your browser settings, but some site
            features—like cart functionality—may not work correctly.
          </p>
        </Section>

        {/* 7. Policy Updates */}
        <Section id="changes" title="7. Changes to This Policy">
          <p>
            We may update this Privacy Policy as needed to reflect changes in
            our services, legal standards, or technology. All updates will be
            posted with the revised date.
          </p>
        </Section>

        {/* 8. Contact */}
        <Section id="contact" title="8. Contact Us">
          <p>
            For privacy-related questions, concerns, or data requests, contact
            our support team:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Email: mechatroniclk@gmail.com</li>
            <li>Phone: +94 72 615 1400</li>
            <li>Live Chat: Available during 24 hours</li>
          </ul>
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

export default Policy;
