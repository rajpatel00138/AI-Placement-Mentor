import ATSCard from "./ATSCard";
import PlacementCard from "./PlacementCard";
import SkillsCard from "./SkillsCard";
import MissingSkillsCard from "./MissingSkillsCard";
import StrengthCard from "./StrengthCard";
import WeaknessCard from "./WeaknessCard";
import SuggestionsCard from "./SuggestionsCard";
import RoadmapCard from "./RoadmapCard";

interface ResumeAnalysisProps {
  analysis: {
    atsScore: number;
    placementReadiness: number;
    skills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
}

export default function ResumeAnalysis({
  analysis,
}: ResumeAnalysisProps) {
  return (
    <div className="mt-10 space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold text-primary">
          Resume Analysis
        </h2>

        <p className="mt-2 text-muted">
          AI generated insights based on your uploaded resume.
        </p>
      </div>

      {/* ATS + Placement */}
      <div className="grid gap-6 md:grid-cols-2">
        <ATSCard score={analysis.atsScore} />

        <PlacementCard
          score={analysis.placementReadiness}
        />
      </div>

      {/* Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <SkillsCard skills={analysis.skills} />

        <MissingSkillsCard
          skills={analysis.missingSkills}
        />
      </div>

      {/* Strength + Weakness */}
      <div className="grid gap-6 md:grid-cols-2">
        <StrengthCard
          strengths={analysis.strengths}
        />

        <WeaknessCard
          weaknesses={analysis.weaknesses}
        />
      </div>

      {/* Suggestions */}
      <SuggestionsCard
        suggestions={analysis.suggestions}
      />

      {/* Roadmap */}
      <RoadmapCard
        suggestions={analysis.suggestions}
      />

    </div>
  );
}