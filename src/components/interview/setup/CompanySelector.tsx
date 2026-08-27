"use client";

import { useState } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Search, Building2, Check } from "lucide-react";

const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Zoho",
  "Adobe",
  "Atlassian",
  "Oracle",
  "Meta",
  "Netflix",
  "Uber",
  "Flipkart",
  "Walmart",
  "Goldman Sachs",
  "Infosys",
  "TCS",
  "Wipro",
];

export default function CompanySelector() {
  const { state, setCompany } = useInterview();
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-heading">
        Select Target Company
      </h2>

      <p className="mt-1 text-xs sm:text-sm text-body-muted">
        Practice interview questions tailored to company-specific hiring patterns.
      </p>

      {/* Search Bar */}
      <div className="relative mt-5">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search target company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-base px-4 py-3 pl-11 text-sm font-medium text-heading placeholder:text-slate-400 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
        />
      </div>

      {/* Company Grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filteredCompanies.map((company) => {
          const active = company === state.company;

          return (
            <button
              key={company}
              type="button"
              onClick={() => setCompany(company)}
              className={`flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                active
                  ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent text-heading"
                  : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-2 transition-colors ${
                    active
                      ? "bg-accent text-on-accent shadow-xs"
                      : "bg-accent/10 text-accent group-hover:bg-accent/20"
                  }`}
                >
                  <Building2 size={18} />
                </div>

                <span className="text-sm font-semibold text-heading">
                  {company}
                </span>
              </div>

              {active && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-on-accent shadow-2xs">
                  <Check size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}