"use client";

import { useEffect, useRef, useState } from "react";
import type { HomePageContent } from "@/types";

type Stat = {
  id: string;
  label: string;
  value: number;
};

function useCountAnimation(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

function StatCard({ label, value }: { label: string; value: number }) {
  const { count, setIsVisible } = useCountAnimation(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [setIsVisible]);

  return (
    <div ref={ref} className="text-center space-y-2">
      <div className="text-sm font-medium text-white md:text-base">{label}</div>
      <div className="text-3xl font-bold text-white md:text-4xl">{count}+</div>
    </div>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/content/home", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: HomePageContent) => {
        if (!data?.stats) return;

        const safeStats: Stat[] = [
          {
            id: "experience",
            label: data.stats.yearsExperienceLabel ?? "Years of Experience",
            value: data.stats.yearsExperience ?? 0,
          },
          {
            id: "products",
            label: data.stats.productsDeliveredLabel ?? "Products Delivered",
            value: data.stats.productsDelivered ?? 0,
          },
          {
            id: "clients",
            label: data.stats.satisfiedClientsLabel ?? "Satisfied Clients",
            value: data.stats.satisfiedClients ?? 0,
          },
          {
            id: "countries",
            label: data.stats.countriesServedLabel ?? "Countries Served",
            value: data.stats.countriesServed ?? 0,
          },
        ].filter((s) => s.value > 0);

        setStats(safeStats);
      })
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  if (stats.length === 0) {
    return (
      <section className="relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <div
            className="rounded-[200px] shadow-2xl p-8 bg-gray-200 animate-pulse"
            style={{ height: "150px" }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative -mt-12 z-10">
      <div className="container mx-auto px-4">
        <div className="rounded-[200px] shadow-2xl p-8 bg-brand-primary">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat) => (
              <StatCard key={stat.id} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
