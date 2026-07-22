"use client";

import { useState } from "react";
import { useInterview } from "@/context/InterviewContext";

import {
  Search,
  Building2,
  Check,
} from "lucide-react";

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
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">

      <h2 className="text-xl font-bold text-white">
        Select Company
      </h2>

      <p className="mt-2 text-slate-400">
        Practice company-specific interview questions.
      </p>

      {/* Search */}

      <div className="relative mt-6">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-violet-500"
        />

      </div>

      {/* Company Grid */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        {filteredCompanies.map((company) => {

          const active = company === state.company;

          return (

            <button
              key={company}
              onClick={() => setCompany(company)}
              className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                active
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-slate-800 bg-slate-950 hover:border-violet-500/40"
              }`}
            >

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-violet-500/15 p-2">

                  <Building2
                    size={18}
                    className="text-violet-400"
                  />

                </div>

                <span className="font-medium text-white">
                  {company}
                </span>

              </div>

              {active && (
                <Check
                  size={18}
                  className="text-green-400"
                />
              )}

            </button>

          );
        })}

      </div>

    </section>
  );
}