import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON parsing with a higher limit to handle long resumes
app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. Perform Skill Gap Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { currentProfile, targetRole, targetIndustry, experienceLevel } = req.body;

    if (!currentProfile || !targetRole) {
      return res.status(400).json({ error: "Current Profile and Target Role are required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class career strategist, technical recruiter, and skills gap analysis AI agent. Your task is to perform an objective, deep skill gap analysis comparing a candidate's profile against their target career goal. Be realistic, highly precise, and provide concrete, actionable learning milestones, project ideas, and interview assessment questions.`;

    const prompt = `Perform a career skill gap analysis based on the following candidate parameters:
- **Current Profile / Resume**: ${currentProfile}
- **Target Role**: ${targetRole}
- **Target Industry**: ${targetIndustry || "General Tech"}
- **Target Seniority / Experience Level**: ${experienceLevel || "Mid-Level"}

Instructions:
1. Compare their skills with real-world requirements for the Target Role and experience level.
2. Formulate an objective match score (0 to 100).
3. Identify strengths (where their current profile matches the target).
4. Identify critical, high, and medium priority skill gaps (at least 3-6 items total). Categorize them clearly.
5. Create a comprehensive, realistic multi-phase step-by-step learning roadmap (3-4 phases) with estimated durations, actions, and specific high-impact practical hands-on project blueprints (one project per phase).
6. Create 3 highly tailored scenario-based technical or interview assessment questions that target their critical/high priority gaps to test their understanding. Include key talking points they should cover.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.INTEGER,
              description: "Match score (0 to 100) based on alignment between current profile and target role requirements"
            },
            summary: {
              type: Type.STRING,
              description: "A professional, concise summary overview of the current alignment, major challenges, and general prognosis"
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of current strengths, matching technologies, or aligned experiences"
            },
            skillsGap: {
              type: Type.ARRAY,
              description: "List of identified skill gaps between current skills and target role requirements",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the missing skill, tool, or methodology (e.g. Kubernetes, System Design, GraphQL)" },
                  category: { type: Type.STRING, description: "Category (e.g. Frontend, Backend, DevOps, Data Science, System Design, Soft Skills)" },
                  priority: { type: Type.STRING, description: "Priority level ('critical' | 'high' | 'medium')" },
                  description: { type: Type.STRING, description: "Detailed explanation of why this gap exists and how it affects their candidacy" },
                  currentStatus: { type: Type.STRING, description: "Suggested status indicator (e.g., 'Not Acquired', 'Basic Exposure', 'Needs Refinement')" }
                },
                required: ["name", "category", "priority", "description", "currentStatus"]
              }
            },
            roadmap: {
              type: Type.ARRAY,
              description: "A structured, linear milestone-based learning roadmap to bridge all identified gaps",
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "Phase name (e.g., 'Phase 1: Advanced Microservices & Messaging')" },
                  duration: { type: Type.STRING, description: "Suggested duration/timeline (e.g., 'Weeks 1-4', '1 Month')" },
                  milestoneTitle: { type: Type.STRING, description: "Specific learning objective of this milestone" },
                  skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific skills or technologies focused on in this phase" },
                  keyTopics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key concepts or modules to research" },
                  actionSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A few clear actionable study and practice steps" },
                  handsOnProject: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Title of a realistic, complex, high-impact project" },
                      description: { type: Type.STRING, description: "Clear explanation of what to build and how it demonstrates mastery" },
                      deliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Concrete technical requirements/deliverables of the project" },
                      techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Technologies to use" }
                    },
                    required: ["title", "description", "deliverables", "techStack"]
                  }
                },
                required: ["phase", "duration", "milestoneTitle", "skillsToLearn", "keyTopics", "actionSteps", "handsOnProject"]
              }
            },
            assessmentQuestions: {
              type: Type.ARRAY,
              description: "Exactly 3 scenario-based interview questions to assess their grasp on key critical gaps",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique question ID (e.g. 'q1', 'q2', 'q3')" },
                  skill: { type: Type.STRING, description: "The specific gap or skill this question tests" },
                  question: { type: Type.STRING, description: "The interview/scenario question itself" },
                  suggestedTalkingPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key technical details or talking points a solid response must contain" }
                },
                required: ["id", "skill", "question", "suggestedTalkingPoints"]
              }
            }
          },
          required: ["matchScore", "summary", "strengths", "skillsGap", "roadmap", "assessmentQuestions"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text.trim());
    return res.json(parsedResult);
  } catch (error: any) {
    console.error("Analysis Endpoint Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during skill gap analysis." });
  }
});

// 3. Evaluate Assessment Answer Endpoint
app.post("/api/evaluate-answer", async (req, res) => {
  try {
    const { question, skill, userAnswer } = req.body;

    if (!question || !skill || !userAnswer) {
      return res.status(400).json({ error: "Question, skill, and userAnswer are required." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite technical interviewer and career mentor. Evaluate the user's answer to the provided technical/scenario question with constructiveness, honesty, and deep professional expertise. Award a score from 0 to 100 based on accuracy, depth, industry best practices, and terminology.`;

    const prompt = `Evaluate the candidate's response to the following interview question:
- **Skill Being Tested**: ${skill}
- **Question**: ${question}
- **Candidate's Answer**: "${userAnswer}"

Please analyze their answer and provide:
1. An objective evaluation score (0-100).
2. Constructive feedback summarizing how well they answered.
3. Key strengths of their answer.
4. Any critical gaps, omissions, or misunderstandings in their answer.
5. An elegant, ideal model answer (how a senior professional or principal engineer would answer the question concisely but comprehensively).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "An evaluation score from 0 to 100" },
            feedback: { type: Type.STRING, description: "Constructive feedback and general critique of their answer" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of details, concepts, or points they correctly addressed" },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Omissions, misconceptions, or areas they should have expanded on" },
            modelAnswer: { type: Type.STRING, description: "The ideal, high-level professional answer they should study" }
          },
          required: ["score", "feedback", "strengths", "gaps", "modelAnswer"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text.trim());
    return res.json(parsedResult);
  } catch (error: any) {
    console.error("Evaluation Endpoint Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during answer evaluation." });
  }
});

// Configure Vite or Static files depending on Environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up production static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
