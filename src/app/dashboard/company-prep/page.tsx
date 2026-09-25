import React from "react";
import { Metadata } from "next";
import CompanyPrepView from "@/components/company-prep/CompanyPrepView";

export const metadata: Metadata = {
  title: "Company-Wise Preparation | AI Placement Mentor",
  description: "Company-specific LeetCode problems curated by frequency and recency for targeted technical interview preparation.",
};

export default function CompanyPrepPage() {
  return <CompanyPrepView />;
}
