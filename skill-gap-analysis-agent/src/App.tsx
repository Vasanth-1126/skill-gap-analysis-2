import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Compass, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Send, 
  CheckCircle, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  Brain,
  AlertTriangle,
  Lightbulb,
  FileText
} from "lucide-react";
import ProfileForm from "./components/ProfileForm";
import CircularProgress from "./components/CircularProgress";
import GapMatrix from "./components/GapMatrix";
import LearningRoadmapTimeline from "./components/LearningRoadmapTimeline";
import { SkillGapAnalysisResult, EvaluationResult } from "./types";

const LOADING_STEPS = [
  "Structuring candidate profile taxonomy...",
  "Querying global target role skills data...",
  "Performing semantic gap comparisons...",
  "Generating multi-phase linear roadmap...",
  "Synthesizing customized portfolio projects...",
  "Formulating scenario assessment questions..."
];

export default function App() {
  const [result, setResult] = useState<SkillGapAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "roadmap" | "coach">("diagnostics");

  // Assessment Simulator State
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [evaluationLoading, setEvaluationLoading] = useState<{ [key: string]: boolean }>({});
  const [evaluationResults, setEvaluationResults] = useState<{ [key: string]: EvaluationResult }>({});

  // Cycle through loading steps to show rich diagnostics in progress
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (params: {
    currentProfile: string;
    targetRole: string;
    targetIndustry: string;
    experienceLevel: string;
  }) => {
    setIsLoading(true);
    setResult(null);
    setUserAnswers({});
    setEvaluationResults({});
    setActiveTab("diagnostics");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze career gaps");
      }

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateAnswer = async (questionId: string, skill: string, questionText: string) => {
    const answer = userAnswers[questionId];
    if (!answer || !answer.trim()) {
      alert("Please type a response before submitting for evaluation!");
      return;
    }

    setEvaluationLoading((prev) => ({ ...prev, [questionId]: true }));

    try {
      const response = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionText,
          skill,
          userAnswer: answer,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to evaluate answer");
      }

      const evalData = await response.json();
      setEvaluationResults((prev) => ({ ...prev, [questionId]: evalData }));
    } catch (error: any) {
      alert(error.message || "An error occurred during evaluation.");
    } finally {
      setEvaluationLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900" id="app-root">
      
      {/* 1. Header/Navigation Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-display font-bold tracking-tight text-slate-900">
                  Skill Gap Analysis Agent
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                  v3.5 Flash
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Objective Talent Alignment & Learning Path Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Diagnostic Service: Online</span>
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: User Input Console (Width: 4/12) */}
          <section className="lg:col-span-4 space-y-6" id="input-section">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">
                  Candidate Console
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Configure your current technical background and specify your desired transition benchmark.
              </p>
              
              <ProfileForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>

            {/* Quick Agent Guidelines summary box */}
            <div className="p-5 bg-blue-50/50 border border-blue-100/60 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 font-display">
                <Award className="w-4 h-4 text-blue-600" />
                <span>BENCHMARKING CRITERIA</span>
              </div>
              <p className="text-[11px] text-blue-900/80 leading-relaxed">
                The agent performs deep semantic parsing on your profile text to evaluate stack congruence, architectural awareness, seniority mismatches, and domain constraints.
              </p>
            </div>
          </section>

          {/* Right Column: Dynamic Analysis Workspace (Width: 8/12) */}
          <section className="lg:col-span-8 space-y-6" id="workspace-section">
            
            {/* Case A: Initial Screen (Empty State) */}
            {!result && !isLoading && (
              <div className="p-8 md:p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-6 shadow-sm flex flex-col items-center justify-center min-h-[500px]" id="empty-state">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                  <Compass className="w-8 h-8 text-blue-600" />
                </div>
                
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-display font-bold text-slate-900">
                    Awaiting Target Diagnostics
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select a transition template from the Candidate Console on the left, or input your specific resume and target job title to launch the objective talent evaluation process.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full pt-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-left space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">1. Skills Mapping</span>
                    <span className="text-[11px] text-slate-500 block leading-normal">
                      The model catalogs strengths and separates hard gaps into a clear priority taxonomy.
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-left space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">2. Linear Roadmap</span>
                    <span className="text-[11px] text-slate-500 block leading-normal">
                      Generates a multi-phase technical curricula complete with customizable hands-on portfolio projects.
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-left space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">3. Scenario Coach</span>
                    <span className="text-[11px] text-slate-500 block leading-normal">
                      Presents real scenario-based interview questions with score evaluations for direct remediation.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Case B: Loading Diagnostics */}
            {isLoading && (
              <div className="p-12 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center space-y-6" id="loading-state">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
                  <Brain className="w-6 h-6 text-blue-600 absolute animate-pulse" />
                </div>
                
                <div className="space-y-2 max-w-md">
                  <h3 className="text-base font-display font-bold text-slate-900 uppercase tracking-wider animate-pulse">
                    Analyzing Skill Dimensions
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-mono">
                    {LOADING_STEPS[loadingStepIndex]}
                  </p>
                </div>

                <div className="w-48 bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full animate-infinite-loading rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            )}

            {/* Case C: Analysis Results Display */}
            {result && !isLoading && (
              <div className="space-y-6" id="results-workspace">
                
                {/* Score Summary Banner */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="shrink-0">
                      <CircularProgress score={result.matchScore} />
                    </div>
                    <div className="text-center md:text-left space-y-1">
                      <h3 className="text-base font-display font-bold text-slate-900">
                        Diagnostics Ready
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                        {result.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => window.print()}
                      className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Export Result</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="border-b border-slate-200 flex items-center justify-between pb-px bg-white p-1 rounded-xl border">
                  <div className="flex gap-1 w-full">
                    <button
                      onClick={() => setActiveTab("diagnostics")}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "diagnostics"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>1. Gap Diagnostics</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("roadmap")}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "roadmap"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>2. Learning Roadmap</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("coach")}
                      className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === "coach"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>3. Assessment Coach</span>
                    </button>
                  </div>
                </div>

                {/* Tab content views */}
                <div className="space-y-6" id="tab-content-panel">
                  {activeTab === "diagnostics" && (
                    <GapMatrix strengths={result.strengths} skillsGap={result.skillsGap} />
                  )}

                  {activeTab === "roadmap" && (
                    <LearningRoadmapTimeline roadmap={result.roadmap} />
                  )}

                  {activeTab === "coach" && (
                    <div className="space-y-6" id="assessment-coach-panel">
                      
                      {/* Coach Intro */}
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">Interactive Gap Assessment Simulation</h4>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                            Challenge your current technical understanding against custom-tailored scenario questions. Draft your answer below and click Evaluate for a comprehensive assessment scorecard.
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-mono font-bold uppercase rounded-full shrink-0 border border-blue-100">
                          Active Simulator
                        </span>
                      </div>

                      {/* Side by side: Question selectors & Active Question area */}
                      <div className="flex flex-col md:flex-row gap-6">
                        
                        {/* Selector buttons */}
                        <div className="md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
                          {result.assessmentQuestions.map((q, idx) => (
                            <button
                              key={q.id}
                              onClick={() => setSelectedQuestionIndex(idx)}
                              className={`text-left p-4 rounded-xl border text-xs transition-all flex flex-col gap-1.5 shrink-0 md:shrink-1 cursor-pointer ${
                                selectedQuestionIndex === idx
                                  ? "bg-white border-blue-500 shadow-sm text-slate-950 font-bold"
                                  : "bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-white"
                              }`}
                            >
                              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                                Challenge {idx + 1}
                              </span>
                              <span className="font-bold tracking-tight text-slate-800 line-clamp-1">{q.skill}</span>
                            </button>
                          ))}
                        </div>

                        {/* Active Question workspace */}
                        {result.assessmentQuestions[selectedQuestionIndex] && (() => {
                          const activeQ = result.assessmentQuestions[selectedQuestionIndex];
                          const answerText = userAnswers[activeQ.id] || "";
                          const isEvaluating = evaluationLoading[activeQ.id] || false;
                          const evaluationResult = evaluationResults[activeQ.id];

                          return (
                            <div className="flex-1 space-y-5 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
                              
                              {/* Scenario block */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-blue-600 font-bold">
                                  <span>Testing Gap:</span>
                                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100">{activeQ.skill}</span>
                                </div>
                                <h4 className="text-sm font-display font-bold text-slate-950 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-xl">
                                  "{activeQ.question}"
                                </h4>
                              </div>

                              {/* Input response editor */}
                              <div className="space-y-2.5">
                                <label className="text-xs font-semibold text-slate-800">
                                  Your Assessment Response
                                </label>
                                <textarea
                                  value={answerText}
                                  onChange={(e) => setUserAnswers({ ...userAnswers, [activeQ.id]: e.target.value })}
                                  placeholder="Type or outline your comprehensive technical answer here..."
                                  disabled={isEvaluating}
                                  className="w-full h-36 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 placeholder-slate-400 resize-none font-sans"
                                />
                                
                                <div className="flex items-center justify-between gap-4">
                                  <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
                                    Include high-impact keywords, architectural considerations, and structural trade-offs for high evaluation scores.
                                  </p>
                                  <button
                                    onClick={() => handleEvaluateAnswer(activeQ.id, activeQ.skill, activeQ.question)}
                                    disabled={isEvaluating || !answerText.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                                  >
                                    {isEvaluating ? (
                                      <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Evaluating Answer...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Evaluate My Response</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Suggest Talking Points box */}
                              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                  <span>Hint: Suggested Talking Points</span>
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {activeQ.suggestedTalkingPoints.map((point, i) => (
                                    <span key={i} className="text-[10px] bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono">
                                      {point}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Evaluation Results Output Panel */}
                              {evaluationResult && (
                                <div className="border-t border-slate-100 pt-5 space-y-4 animate-in fade-in-50 duration-200" id="assessment-result">
                                  
                                  {/* Score Header */}
                                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    <div>
                                      <span className="text-[10px] font-mono font-semibold uppercase text-slate-450 tracking-wider">
                                        Evaluation Score
                                      </span>
                                      <h5 className="text-xs text-slate-600 font-semibold mt-0.5">
                                        {evaluationResult.feedback}
                                      </h5>
                                    </div>
                                    <div className="text-center shrink-0">
                                      <div className={`text-2xl font-display font-bold ${
                                        evaluationResult.score >= 80 ? "text-emerald-600" : evaluationResult.score >= 50 ? "text-amber-600" : "text-rose-600"
                                      }`}>
                                        {evaluationResult.score}/100
                                      </div>
                                      <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold">AI Verified</span>
                                    </div>
                                  </div>

                                  {/* Strengths & Gaps lists */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2">
                                      <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span>Strengths Highlighted</span>
                                      </h6>
                                      <ul className="space-y-1.5">
                                        {evaluationResult.strengths.map((st, i) => (
                                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                                            <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                                            <span>{st}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl space-y-2">
                                      <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                                        <span>Identified Omissions</span>
                                      </h6>
                                      <ul className="space-y-1.5">
                                        {evaluationResult.gaps.map((gp, i) => (
                                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                                            <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                                            <span>{gp}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Golden Standard Model Answer Box */}
                                  <div className="p-5 bg-slate-900 text-white rounded-xl space-y-2 shadow-sm">
                                    <h6 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                                      Exemplary Model Response
                                    </h6>
                                    <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                                      {evaluationResult.modelAnswer}
                                    </p>
                                  </div>

                                </div>
                              )}

                            </div>
                          );
                        })()}

                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

          </section>

        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 text-center text-xs text-slate-400" id="app-footer">
        <p className="font-mono">Skill Gap Analysis Agent — Delivered via High-Performance Gemini 3.5 Models</p>
      </footer>
    </div>
  );
}
