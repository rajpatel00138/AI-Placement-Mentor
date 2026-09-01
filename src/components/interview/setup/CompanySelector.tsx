"use client";

import { useState, useMemo } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Search, Building2, Check, Sparkles, Filter, X } from "lucide-react";
import {
  TARGET_COMPANIES,
  COMPANY_CATEGORIES,
  type CompanyCategory,
  type Company,
} from "@/constants/companies";

export default function CompanySelector() {
  const { state, setCompany } = useInterview();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | CompanyCategory>("All");

  const filteredCompanies = useMemo(() => {
    return TARGET_COMPANIES.filter((company) => {
      const matchesCategory =
        selectedCategory === "All" || company.category === selectedCategory;

      const query = search.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesName = company.name.toLowerCase().includes(query);
      const matchesCategoryName = company.category.toLowerCase().includes(query);
      const matchesTag = company.tag?.toLowerCase().includes(query) ?? false;

      // If user typed a search query, prioritize matching text across categories or within selected
      return (matchesName || matchesCategoryName || matchesTag) && (selectedCategory === "All" || matchesCategory);
    });
  }, [search, selectedCategory]);

  const selectedCompanyObj = TARGET_COMPANIES.find((c) => c.name === state.company);

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-heading">
              Select Target Company
            </h2>
            <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              {TARGET_COMPANIES.length} Available
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-body-muted">
            Practice interview rounds tailored to company-specific hiring patterns & domain expectations.
          </p>
        </div>

        {state.company && (
          <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-2xl border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Target: <strong>{state.company}</strong></span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mt-5">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search target company by name, sector, or tag (e.g. Google, FinTech, FAANG)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-base px-4 py-3 pl-11 pr-10 text-sm font-medium text-heading placeholder:text-slate-400 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
        />

        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-heading hover:bg-soft transition"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {COMPANY_CATEGORIES.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          const count =
            cat.id === "All"
              ? TARGET_COMPANIES.length
              : TARGET_COMPANIES.filter((c) => c.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                isCatActive
                  ? "bg-accent text-on-accent shadow-2xs"
                  : "bg-base border border-border text-body-muted hover:text-heading hover:bg-soft"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] rounded-md px-1.5 py-0.2 ${
                  isCatActive
                    ? "bg-white/20 text-white"
                    : "bg-soft text-body-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Company Grid (Scrollable Container) */}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-1 space-y-2">
        {filteredCompanies.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredCompanies.map((company) => {
              const active = company.name === state.company;

              return (
                <button
                  key={company.name}
                  type="button"
                  onClick={() => setCompany(company.name)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-accent bg-accent/10 shadow-sm shadow-accent/15 ring-1 ring-accent text-heading"
                      : "border-border bg-base hover:border-accent/50 hover:bg-soft/20 dark:hover:bg-soft/10 text-heading"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`rounded-xl p-2.5 transition-colors shrink-0 ${
                        active
                          ? "bg-accent text-on-accent shadow-xs"
                          : "bg-accent/10 text-accent group-hover:bg-accent/20"
                      }`}
                    >
                      <Building2 size={18} />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-heading truncate">
                          {company.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-medium text-body-muted truncate">
                          {company.tag || company.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {active && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-2xs">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center bg-base/50">
            <Building2 className="h-10 w-10 text-slate-400 mb-2 opacity-50" />
            <p className="text-sm font-semibold text-heading">
              No companies match &quot;{search}&quot;
            </p>
            <p className="text-xs text-body-muted mt-1 max-w-xs">
              Try adjusting your search terms or switch category filter to &quot;All Companies&quot;.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent/10 border border-accent/20 px-3.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-body-muted">
        <span>
          Showing <strong>{filteredCompanies.length}</strong> of {TARGET_COMPANIES.length} companies
        </span>
        {selectedCompanyObj && (
          <span className="truncate max-w-[200px] text-right">
            Selected: <strong className="text-heading">{selectedCompanyObj.name}</strong> ({selectedCompanyObj.category})
          </span>
        )}
      </div>
    </section>
  );
}