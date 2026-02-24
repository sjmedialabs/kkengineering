"use client";

import type { HomePageContent } from "@/types";

type ProcessStep = {
  number?: string | number;
  title?: string;
  description?: string;
};

export function ProcessSection({
  content,
}: {
  content?: HomePageContent["process"];
}) {
  const steps: ProcessStep[] = Array.isArray(content?.steps)
    ? content.steps
    : [];

  if (steps.length === 0) {
    return null; // nothing to render if no steps
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="hidden lg:flex justify-between items-start relative">
          {steps.map((step, index) => (
            <div
              key={`${step.number ?? "step"}-${index}`}
              className="flex-1 relative"
            >
              <div
                className={`flex flex-col items-center text-center space-y-6 ${
                  index % 2 === 1 ? "mt-16" : "mt-0"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center text-xl font-bold">
                  {step.number ?? index + 1}
                </div>

                <h3 className="text-lg font-semibold">
                  {step.title ?? "Step"}
                </h3>

                <p className="text-gray-600 max-w-xs">
                  {step.description ?? ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
