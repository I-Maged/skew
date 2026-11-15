import { z } from "zod";

export const AnalysisOutputSchema = z.object({
  summary: z.string().min(1).describe("Neutral summary of the article"),
  sentimentScore: z.number().min(-1).max(1).describe("Sentiment from -1 (negative) to 1 (positive)"),
  sentimentLabel: z.enum(["positive", "neutral", "negative"]),
  biasLabel: z.enum(["left", "center", "right", "mixed", "unclear"]),
  leftPercentage: z.number().int().min(0).max(100),
  centerPercentage: z.number().int().min(0).max(100),
  rightPercentage: z.number().int().min(0).max(100),
  confidence: z.number().min(0).max(1).describe("Confidence in framing estimate, 0 to 1"),
  framingNotes: z.array(z.string()).describe("Short framing observations"),
  loadedTerms: z.array(z.string()).describe("Loaded/emotionally charged terms found"),
  disclaimer: z.string().min(1),
}).refine(
  (v) => v.leftPercentage + v.centerPercentage + v.rightPercentage === 100,
  { message: "left/center/right percentages must sum to 100" },
);

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;