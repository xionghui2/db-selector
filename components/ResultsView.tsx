import React from 'react';
import { AnalysisResult, Recommendation } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Check, X, Info, Download, RefreshCcw, Cpu, Server } from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  // Sort recommendations by score descending
  const sortedRecs = [...result.recommendations].sort((a, b) => b.score - a.score);
  const topPick = sortedRecs[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">数据库选型报告</h1>
          <p className="text-slate-500 mt-1">基于业务场景、成本及信创要求的智能化评估</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            重新评估
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            导出 PDF
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Info size={20} className="text-indigo-500" />
          选型综述 (Executive Summary)
        </h2>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          {result.summary}
        </p>
      </div>

      {/* Top Pick Highlight & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Recommendation Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-500 bg-opacity-30 rounded-full text-xs font-semibold mb-4 border border-indigo-400">
              最佳匹配 (BEST MATCH)
            </div>
            <h3 className="text-3xl font-bold mb-1">{topPick.name}</h3>
            <div className="text-indigo-100 text-sm mb-6">{topPick.matchReason.substring(0, 80)}...</div>
          </div>

          <div className="flex items-end gap-2">
             <span className="text-6xl font-bold">{topPick.score}</span>
             <span className="text-xl font-medium mb-2 text-indigo-200">/100</span>
          </div>
        </div>

        {/* Score Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">适配度评分对比</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedRecs} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={100} tick={{fill: '#475569', fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                  {sortedRecs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Cards */}
      <h2 className="text-xl font-bold text-slate-900 mt-8">详细分析 (Detailed Analysis)</h2>
      <div className="space-y-6">
        {sortedRecs.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                  {rec.score}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{rec.name}</h3>
                  <p className="text-sm text-slate-500">排名 #{idx + 1}</p>
                </div>
              </div>
              <div className="text-sm font-medium px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
                符合度: {rec.score}%
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                   <h4 className="font-semibold text-slate-900 mb-2">匹配理由 (Reason)</h4>
                   <p className="text-slate-600 text-sm leading-relaxed text-justify">{rec.matchReason}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                   <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                      <Server size={16} className="text-indigo-500"/> 部署建议 (Deployment)
                   </h4>
                   <p className="text-slate-600 text-sm leading-relaxed">{rec.deploymentAdvice}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                   <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                      <Cpu size={16} className="text-blue-600"/> 信创适配 (Xinchuang)
                   </h4>
                   <p className="text-blue-800 text-sm leading-relaxed">{rec.xinchuangFit}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 h-full">
                  <h5 className="font-semibold text-green-800 text-sm mb-3 flex items-center gap-2">
                    <Check size={16} /> 优势 (Pros)
                  </h5>
                  <ul className="space-y-2">
                    {rec.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-green-700 flex items-start gap-2">
                        <span className="mt-1 block min-w-[4px] min-h-[4px] rounded-full bg-green-500"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100 h-full">
                  <h5 className="font-semibold text-red-800 text-sm mb-3 flex items-center gap-2">
                    <X size={16} /> 劣势/风险 (Cons)
                  </h5>
                  <ul className="space-y-2">
                    {rec.cons.map((con, i) => (
                      <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                        <span className="mt-1 block min-w-[4px] min-h-[4px] rounded-full bg-red-400"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;