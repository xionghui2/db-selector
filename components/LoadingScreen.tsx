import React, { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

const loadingMessages = [
  "正在分析业务场景...",
  "评估信创硬件兼容性 (Kunpeng/Hygon)...",
  "计算高可用副本策略...",
  "对比数据库技术指标 (OceanBase vs GaussDB vs TiDB)...",
  "正在生成最终选型报告..."
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full border-4 border-indigo-100">
          <BrainCircuit size={48} className="text-indigo-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">AI 架构师思考中</h3>
      <p className="text-slate-500 h-6 transition-all duration-300 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>

      <div className="mt-8 flex gap-2">
         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;