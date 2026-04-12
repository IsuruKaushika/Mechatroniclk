import React, { useState } from "react";
import { assets } from "../assets/assets";
import PackageSelector from "../components/PackageSelector";
import ComparePackages from "../components/ComparePackages";
import Title from "../components/Title";
import ProjectCarousel from "../components/Service3D/ProjectCarousel";
import ServiceAbout from "../components/Service3D/ServiceAbout";
import PreviousWorks from "../components/Service3D/PreviousWorks";
import ServiceFAQ from "../components/Service3D/ServiceFAQ";
import ServiceCustomOffer from "../components/Service3D/ServiceCustomOffer";
import ServiceReviews from "../components/Service3D/ServiceReviews";
// Data
const heroProjects = [
  {
    image: assets.slide1,
    title: "Industrial Product Render",
    subtitle: "Clean visuals for client presentations",
    category: "Render",
  },
  {
    image: assets.slide2,
    title: "Consumer Device Concept",
    subtitle: "Product-focused 3D marketing shots",
    category: "Marketing",
  },
  {
    image: assets.slide3,
    title: "Mechanical Assembly Visual",
    subtitle: "Detailed modeling and realistic lighting",
    category: "Engineering",
  },
  {
    image: assets.slide4,
    title: "Retail Product Showcase",
    subtitle: "Professional renders ready for launch",
    category: "Ecommerce",
  },
];

const portfolioItems = [
  {
    image: assets.slide1,
    title: "Exploded Mechanical Assembly",
    category: "Engineering Visual",
  },
  {
    image: assets.slide2,
    title: "Smart Device Product Launch",
    category: "Marketing Render",
  },
  {
    image: assets.slide3,
    title: "Packaging + Product Scene",
    category: "Ecommerce Asset",
  },
  {
    image: assets.slide4,
    title: "Concept Model to Final Render",
    category: "Concept Visualization",
  },
];

const packages = [
  {
    id: "basic",
    label: "Basic",
    price: 40,
    description: "Simple model with rendering",
    delivery: 3,
    revisions: 1,
    mostPopular: false,
    features: [
      { label: "3D modeling", included: true },
      { label: "1 3D render", included: true },
      { label: "Texturing & lighting", included: false },
      { label: "Include animation", included: false },
      { label: "Source file", included: true },
    ],
  },
  {
    id: "standard",
    label: "Standard",
    price: 100,
    description: "Detailed model with rendering, texturing, and realistic presentation output.",
    delivery: 4,
    revisions: 4,
    mostPopular: true,
    features: [
      { label: "3D modeling", included: true },
      { label: "3 3D renders", included: true },
      { label: "Texturing & lighting", included: true },
      { label: "Include animation", included: false },
      { label: "Source file", included: true },
    ],
  },
  {
    id: "premium",
    label: "Premium",
    price: 180,
    description:
      "Complex model with realistic rendering, advanced texturing, and technical drawings.",
    delivery: 6,
    revisions: 5,
    mostPopular: false,
    features: [
      { label: "3D modeling", included: true },
      { label: "5 3D renders", included: true },
      { label: "Texturing & lighting", included: true },
      { label: "Include animation", included: true },
      { label: "Source file", included: true },
    ],
  },
];

const comparisonRows = [
  { label: "3D modeling", basic: "check", standard: "check", premium: "check" },
  { label: "Texturing & lighting", basic: "muted", standard: "check", premium: "check" },
  { label: "Include animation", basic: "muted", standard: "muted", premium: "check" },
  { label: "Source file", basic: "check", standard: "check", premium: "check" },
  { label: "3D renders", basic: "1", standard: "3", premium: "5" },
  { label: "Delivery time", basic: "3 days", standard: "4 days", premium: "6 days" },
  { label: "Total", basic: "US$40", standard: "US$100", premium: "US$180" },
];

const reviewSummary = [
  { label: "5 Stars", count: 16, width: "96%" },
  { label: "4 Stars", count: 9, width: "8%" },
  { label: "3 Stars", count: 3, width: "2%" },
  { label: "2 Stars", count: 0, width: "0%" },
  { label: "1 Star", count: 0, width: "0%" },
];

const ratingBreakdown = [
  { label: "Communication level", score: "5" },
  { label: "Quality of delivery", score: "5" },
  { label: "Value of delivery", score: "4.9" },
];

const reviewCards = [
  {
    initials: "H",
    name: "havensnow",
    country: "United States",
    rating: "5",
    time: "1 month ago",
    comment:
      "Professional, responsive, and very easy to work with. The final model looked polished and the delivery was faster than expected.",
    price: "US$50-US$100",
    duration: "1 day",
    image: assets.slide1,
  },
  {
    initials: "R",
    name: "roshenlab",
    country: "Australia",
    rating: "5",
    time: "3 weeks ago",
    comment:
      "Great attention to detail and strong communication throughout the project. The render quality was perfect for our presentation.",
    price: "US$100-US$180",
    duration: "4 days",
    image: assets.slide2,
  },
];

const Service3DDesign = () => {
  const [selectedPackage, setSelectedPackage] = useState("standard");

  return (
    <div className="pb-24 text-slate-800 lg:pb-16">
      {/* Carousel + Packages Grid */}
      <section className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_380px]">
        {/* Left Side: Carousel */}
        <div>
          {/* Service Headline */}
          <div className="text-3xl w-fit mb-8 pt-10 uppercase">
            <Title text1={"Professional 3D Modeling "} text2={"& Product Designing"} />
          </div>
          <ProjectCarousel projects={heroProjects} />
          {/* About This Service */}
          <div className="mt-8">
            <ServiceAbout />
          </div>

          {/* Previous Works (Desktop Only) */}
          <PreviousWorks portfolioItems={portfolioItems} />

          {/* Compare Packages */}
          <ComparePackages comparisonRows={comparisonRows} />

          {/* Reviews */}
          <div className="mt-8">
            <ServiceReviews
              reviewSummary={reviewSummary}
              ratingBreakdown={ratingBreakdown}
              reviewCards={reviewCards}
            />
          </div>

          {/* FAQ + Custom Offer */}
          <section className="grid gap-6 py-14 lg:grid-cols-[1fr_1fr]">
            <ServiceFAQ />
            <ServiceCustomOffer />
          </section>

          {/* Mobile Bottom Action Bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-4 backdrop-blur lg:hidden">
            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                Chat
              </button>
              <button className="rounded-md bg-[#1dbf73] px-4 py-3 text-sm font-semibold text-white">
                Continue - US$100
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Packages */}
        <PackageSelector
          packages={packages}
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
        />
      </section>
    </div>
  );
};

export default Service3DDesign;
