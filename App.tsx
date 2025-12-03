import React, { useState } from 'react';
import StepWizard from './components/StepWizard';
import LoadingScreen from './components/LoadingScreen';
import ResultsView from './components/ResultsView';
import { AssessmentData, AnalysisResult, AppStep } from './types';
import { generateDbRecommendation } from './services/geminiService';
import { DatabaseZap } from 'lucide-react';

const initialData: AssessmentData = {
  businessType: 'oltp',
  dataVolume: 'medium',
  concurrency: 'medium',
  compatibility: 'mysql',
  currentStack: 'new_project',
  deployment: 'cloud_managed',
  haRequirement: 'paxos_3',
  hardwareArch: 'x86_generic',
  futureFocus: 'stability'
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateData = (key: keyof AssessmentData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step === AppStep.INFRA) {
      setStep(AppStep.ANALYZING);
      try {
        const analysis = await generateDbRecommendation(data);
        setResult(analysis);
        setStep(AppStep.RESULTS);
      } catch (err) {
        console.error(err);
        setError("生成报告失败，请检查 API Key 后重试。");
        setStep(AppStep.INFRA); // Go back to allow retry
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleReset = () => {
    setStep(AppStep.WELCOME);
    setData(initialData);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <DatabaseZap className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">DB Selector <span className="text-indigo-600">AI</span></span>
          </div>
          {step > AppStep.WELCOME && step < AppStep.RESULTS && (
             <div className="text-sm font-medium text-slate-500 hidden sm:block">
                步骤 {step} / 3
             </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {step === AppStep.WELCOME && (
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              企业级数据库智能选型助手 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-3xl md:text-5xl mt-2 block">
                专注信创与国产化替代
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
              不仅仅是问答，更是结构化的技术咨询。结合您的业务场景、高可用规范、信创硬件环境（鲲鹏/海光等）以及存量系统现状，为您生成专业的选型分析报告。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="text-2xl mb-2">🇨🇳</div>
                 <h3 className="font-semibold text-slate-900">信创适配</h3>
                 <p className="text-sm text-slate-500 mt-1">鲲鹏/海光等国产芯片深度兼容性分析。</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="text-2xl mb-2">🔄</div>
                 <h3 className="font-semibold text-slate-900">现状评估</h3>
                 <p className="text-sm text-slate-500 mt-1">Oracle/MySQL 迁移成本与平滑度方案。</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="text-2xl mb-2">🛡️</div>
                 <h3 className="font-semibold text-slate-900">高可用规范</h3>
                 <p className="text-sm text-slate-500 mt-1">两地三中心、Paxos 多副本架构建议。</p>
               </div>
            </div>

            <button 
              onClick={() => setStep(AppStep.SCENARIO)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1"
            >
              开始选型评估
            </button>
          </div>
        )}

        {(step === AppStep.SCENARIO || step === AppStep.TECH || step === AppStep.INFRA) && (
          <StepWizard 
            currentStep={step} 
            data={data} 
            updateData={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === AppStep.ANALYZING && <LoadingScreen />}

        {step === AppStep.RESULTS && result && (
          <ResultsView result={result} onReset={handleReset} />
        )}

      </main>
    </div>
  );
};

export default App;