import { useState } from "react";
import { CheckCircle, AlertTriangle, ShieldCheck, Filter, HelpCircle } from "lucide-react";
import { SkillGapItem } from "../types";

interface GapMatrixProps {
  strengths: string[];
  skillsGap: SkillGapItem[];
}

export default function GapMatrix({ strengths, skillsGap }: GapMatrixProps) {
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [selectedGap, setSelectedGap] = useState<SkillGapItem | null>(null);

  const filteredGaps = skillsGap.filter(gap => {
    if (priorityFilter === 'all') return true;
    return gap.priority === priorityFilter;
  });

  const getPriorityStyles = (priority: 'critical' | 'high' | 'medium') => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-rose-50/30 border-rose-100 text-rose-950 hover:bg-rose-50/60',
          badge: 'bg-rose-100 text-rose-700 border-rose-200'
        };
      case 'high':
        return {
          bg: 'bg-amber-50/30 border-amber-100 text-amber-950 hover:bg-amber-50/60',
          badge: 'bg-amber-100 text-amber-700 border-amber-200'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50/30 border-blue-100 text-blue-950 hover:bg-blue-50/60',
          badge: 'bg-blue-100 text-blue-700 border-blue-200'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aligned Strengths */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-display font-bold mb-3.5 text-sm uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Existing Capital ({strengths.length})</span>
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/40 border border-emerald-100 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No exact match found; focus on transferrable skills.</p>
          )}
        </div>

        {/* Skill Gap Summary Header */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-display font-bold mb-2.5 text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Priority Taxonomy</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Your gaps represent skill sets mandatory for target benchmarks. We categorise them by structural severity. Click on any gap card to see why this gap is vital and how to approach it.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-center">
              <div className="text-sm font-bold text-rose-600">
                {skillsGap.filter(g => g.priority === 'critical').length}
              </div>
              <div className="text-[10px] text-slate-500 font-medium font-mono uppercase">Critical</div>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-center">
              <div className="text-sm font-bold text-amber-600">
                {skillsGap.filter(g => g.priority === 'high').length}
              </div>
              <div className="text-[10px] text-slate-500 font-medium font-mono uppercase">High</div>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <div className="text-sm font-bold text-blue-600">
                {skillsGap.filter(g => g.priority === 'medium').length}
              </div>
              <div className="text-[10px] text-slate-500 font-medium font-mono uppercase">Medium</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Filter and Matrix List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h4 className="text-sm font-display font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-blue-600" />
            <span>Map Skill Gaps ({filteredGaps.length})</span>
          </h4>
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['all', 'critical', 'high', 'medium'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Grid of Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGaps.map((gap, i) => {
            const styles = getPriorityStyles(gap.priority);
            return (
              <div
                key={i}
                onClick={() => setSelectedGap(gap)}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-slate-350 hover:shadow-md shadow-sm bg-white ${styles.bg}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold">
                        {gap.category}
                      </span>
                      <h5 className="text-sm font-display font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                        {gap.name}
                      </h5>
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${styles.badge}`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {gap.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                    <span>Status: <strong className="text-slate-700">{gap.currentStatus}</strong></span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-1 font-mono">
                    Explore Strategy ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Gap Modal (Overlay) */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600 uppercase tracking-wider">
                  {selectedGap.category}
                </span>
                <h4 className="text-lg font-display font-bold text-slate-900 mt-2">
                  {selectedGap.name}
                </h4>
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriorityStyles(selectedGap.priority).badge}`}>
                {selectedGap.priority} Priority
              </span>
            </div>

            <hr className="border-slate-100 my-4" />

            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">Gap Analysis</h5>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedGap.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-slate-400">Current Competency Assessment</div>
                <div className="text-xs text-slate-700 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Agent Baseline Verdict: <strong className="text-blue-600">{selectedGap.currentStatus}</strong></span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">Tactical Remediation</h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To master this gap, navigate to the <strong className="text-blue-600">Learning Roadmap</strong> tab to see which milestone focuses on {selectedGap.name}. Use the <strong className="text-blue-600">Interactive Assessment Coach</strong> to test your existing knowledge of this topic.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedGap(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
