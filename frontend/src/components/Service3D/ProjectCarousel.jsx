import React, { useState } from "react";

const ProjectCarousel = ({ projects }) => {
  const [activeProject, setActiveProject] = useState(0);

  const handlePrevious = () => {
    setActiveProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveProject((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const currentProject = projects[activeProject];

  return (
    <div>
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="relative h-[280px] sm:h-[400px] w-full bg-slate-100 flex items-center justify-center">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-contain"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white p-2 sm:p-3 transition shadow-md"
            aria-label="Previous project"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 hover:bg-white p-2 sm:p-3 transition shadow-md"
            aria-label="Next project"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Project Info Overlay (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <p className="text-sm text-white/90">{currentProject.subtitle}</p>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-6 overflow-x-auto">
          <div className="flex gap-3 sm:gap-4">
            {projects.map((project, index) => (
              <button
                key={project.title}
                onClick={() => setActiveProject(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  index === activeProject
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-1"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
