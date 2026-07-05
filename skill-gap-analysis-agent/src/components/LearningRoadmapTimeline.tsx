import { useState } from "react";
import { RoadmapMilestone } from "../types";
import { BookOpen, CheckSquare, Calendar, Hammer, Layers, Terminal } from "lucide-react";

interface LearningRoadmapTimelineProps {
  roadmap: RoadmapMilestone[];
}

export default function LearningRoadmapTimeline({ roadmap }: LearningRoadmapTimelineProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const activeMilestone = roadmap[activePhaseIndex];

  return (
    <div className="space-y-6">
      {/* 1. Header description */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wide">Closing Gaps Linear Curricula</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
            This structured path was custom designed by your AI Agent to bridge your specific gaps. Complete the phases in order, building the recommended project in each milestone.
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full shrink-0 font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Duration: {roadmap.length} Phases</span>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 2. Interactive Phase Picker */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Vertical Steps Navigation */}
        <div className="md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {roadmap.map((milestone, i) => (
            <button
              key={i}
              onClick={() => setActivePhaseIndex(i)}
              className={`text-left p-3.5 rounded-xl border text-xs transition-all flex items-center gap-3 shrink-0 md:shrink-1 cursor-pointer ${
                activePhaseIndex === i
                  ? "bg-white border-blue-500 shadow-sm text-slate-900 font-bold"
                  : "bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                activePhaseIndex === i
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}>
                {i + 1}
              </div>
              <div>
                <div className="font-bold tracking-tight line-clamp-1">{milestone.phase}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{milestone.duration}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Active Phase Detailed View */}
        {activeMilestone && (
          <div className="flex-1 space-y-5 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
            {/* Phase Title Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {activeMilestone.duration}
                </span>
                <h4 className="text-base font-display font-bold text-slate-900 mt-2">
                  {activeMilestone.phase}
                </h4>
              </div>
              <div className="text-xs text-slate-400 font-mono italic">
                Objective: {activeMilestone.milestoneTitle}
              </div>
            </div>

            {/* Curriculum Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Skills to Learn & Key Topics */}
              <div className="p-4 bg-slate-50/50 border border-slate-200/65 rounded-xl space-y-3">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Topic Syllabus</span>
                </h5>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Target Competencies:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {activeMilestone.skillsToLearn.map((skill, i) => (
                      <span key={i} className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Study Modules:</span>
                  <ul className="space-y-1">
                    {activeMilestone.keyTopics.map((topic, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-blue-500 font-mono mt-0.5">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Steps */}
              <div className="p-4 bg-slate-50/50 border border-slate-200/65 rounded-xl space-y-3">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>Action Steps</span>
                </h5>
                <ul className="space-y-2">
                  {activeMilestone.actionSteps.map((step, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                      <span className="flex items-center justify-center w-4 h-4 bg-white border border-slate-200 text-slate-500 rounded-full font-mono text-[9px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Portfolio Project Blueprint */}
            {activeMilestone.handsOnProject && (
              <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                    <Hammer className="w-4 h-4" />
                    <span>Hands-On Capstone Project</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 uppercase bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                    Build for Portfolio
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-sm font-display font-bold text-white">
                    {activeMilestone.handsOnProject.title}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeMilestone.handsOnProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3.5 border-t border-slate-800">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-slate-400" />
                      <span>Recommended Architecture Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeMilestone.handsOnProject.techStack.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 border border-slate-700 text-blue-300 font-mono px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Concrete Key Deliverables</span>
                    </div>
                    <ul className="space-y-1 mt-1.5">
                      {activeMilestone.handsOnProject.deliverables.map((deliv, i) => (
                        <li key={i} className="text-[11px] text-slate-200 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-blue-400 font-bold shrink-0">✔</span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
