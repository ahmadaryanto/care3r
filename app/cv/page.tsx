import type { Metadata } from "next";
import LandingPage from "@/components/talent/LandingPage";
import { MOCK_CANDIDATES } from "@/lib/talent/mock-candidates";

export const metadata: Metadata = {
  title: "Free CV Power Score for Web3 roles | care3r",
  description:
    "Scan your CV and get a free CV Power Score out of 100 with strengths, gaps, and concrete fixes, plus a shareable card. Private by default.",
  alternates: { canonical: "/cv" },
};

export default function CvLandingPage() {
  // Showcase card is a labelled sample profile, not a real candidate.
  const sampleCard = MOCK_CANDIDATES.find((c) => c.id === "ashley-tan") ?? MOCK_CANDIDATES[0];
  return <LandingPage sampleCard={sampleCard} />;
}
