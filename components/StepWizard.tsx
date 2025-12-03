import React from 'react';
import { AssessmentData, AppStep } from '../types';
import { ArrowRight, Database, Server, Cpu, CheckCircle, ShieldCheck, TrendingUp, History } from 'lucide-react';

interface StepWizardProps {
  currentStep: AppStep;
  data: AssessmentData;
  updateData: (key: keyof AssessmentData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepWizard: React.FC<StepWizardProps> = ({ currentStep, data, updateData, onNext, onBack }) => {
  
  const renderOption = (
    label: string,
    description: string,
    value: string,
    currentValue: string,
    field: keyof AssessmentData,
    icon: React.ReactNode
  ) => (
    <button
      onClick={() => updateData(field, value)}
      className={`group relative flex items-start w-full p-4 mb-3 rounded-xl border-2 transition-all duration-200 text-left
        ${currentValue === value 
          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
    >
      <div className={`p-2 rounded-lg mr-4 transition-colors ${currentValue === value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'}`}>
        {icon}
      </div>
      <div className="flex-1 pr-6">
        <h3 className={`font-bold text-base ${currentValue === value ? 'text-indigo-900' : 'text-slate-800'}`}>
          {label}
        </h3>
        <p className={`text-xs mt-1 ${currentValue === value ? 'text-indigo-700' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
      {currentValue === value && (
        <div className="absolute top-4 right-4 text-indigo-600">
          <CheckCircle size={20} fill="currentColor" className="text-white" />
        </div>
      )}
    </button>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case AppStep.SCENARIO:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">业务场景评估</h2>
            <p className="text-slate-500 mb-6">明确数据库的使用场景、数据规模及未来发展方向。</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Database size={16}/> 负载类型 (Workload)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderOption('OLTP 交易型', '高频短小事务，如金融交易、订单系统。', 'oltp', data.businessType, 'businessType', <Database size={18}/>)}
                  {renderOption('OLAP 分析型', '海量数据复杂查询，如BI报表、画像分析。', 'olap', data.businessType, 'businessType', <Database size={18}/>)}
                  {renderOption('HTAP 混合负载', '同时支持实时交易与实时分析。', 'htap', data.businessType, 'businessType', <Database size={18}/>)}
                  {renderOption('Hybrid 多模混合', '关系型与非结构化数据混合存储。', 'hybrid', data.businessType, 'businessType', <Database size={18}/>)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">数据规模</label>
                   <select 
                    value={data.dataVolume}
                    onChange={(e) => updateData('dataVolume', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                   >
                     <option value="small">小型 (&lt; 100GB)</option>
                     <option value="medium">中型 (100GB - 1TB)</option>
                     <option value="large">大型 (1TB - 10TB)</option>
                     <option value="massive">超大规模 (&gt; 10TB)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">并发要求</label>
                   <select 
                    value={data.concurrency}
                    onChange={(e) => updateData('concurrency', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                   >
                     <option value="low">低并发 (&lt; 100 TPS)</option>
                     <option value="medium">中等 (100 - 2k TPS)</option>
                     <option value="high">高并发 (2k - 10k TPS)</option>
                     <option value="extreme">极高并发 (&gt; 10k TPS)</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={16}/> 未来发展趋势
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {renderOption('极致稳定', '金融核心要求，RPO=0，RTO<30s。', 'stability', data.futureFocus, 'futureFocus', <ShieldCheck size={18}/>)}
                  {renderOption('云原生弹性', '业务波动大，需秒级扩缩容。', 'elasticity', data.futureFocus, 'futureFocus', <Server size={18}/>)}
                  {renderOption('AI 自治', '减少运维人力，智能调优。', 'ai_ops', data.futureFocus, 'futureFocus', <Cpu size={18}/>)}
                  {renderOption('降本增效', '极致的资源利用率与存储压缩。', 'cost', data.futureFocus, 'futureFocus', <TrendingUp size={18}/>)}
                </div>
              </div>
            </div>
          </div>
        );
      case AppStep.TECH:
        return (
          <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-900 mb-2">技术现状分析</h2>
             <p className="text-slate-500 mb-6">分析当前存量系统架构及迁移兼容性需求。</p>

             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <History size={16} /> 当前现状 (Current Status)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {renderOption('Oracle 旧系统下移', '去O项目，需考虑存储过程与PL/SQL兼容。', 'oracle_legacy', data.currentStack, 'currentStack', <Database size={18}/>)}
                    {renderOption('MySQL 分库分表', '现有中间件架构复杂，寻求分布式原生。', 'mysql_sharding', data.currentStack, 'currentStack', <Database size={18}/>)}
                    {renderOption('已有 OB/国产库', '已部署OceanBase等，需扩展新业务场景。', 'ob_usage', data.currentStack, 'currentStack', <Database size={18}/>)}
                    {renderOption('全新项目', '无历史包袱，寻求最佳技术选型。', 'new_project', data.currentStack, 'currentStack', <Database size={18}/>)}
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">技术相似度 (兼容协议)</label>
                  <p className="text-xs text-slate-400 mb-2">选择与现有应用开发习惯最匹配的协议。</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {renderOption('MySQL 兼容', '应用广泛，开发门槛低。', 'mysql', data.compatibility, 'compatibility', <Cpu size={18}/>)}
                    {renderOption('Oracle 兼容', '核心业务平滑迁移。', 'oracle', data.compatibility, 'compatibility', <Cpu size={18}/>)}
                    {renderOption('PostgreSQL 兼容', '丰富的数据类型与插件生态。', 'postgresql', data.compatibility, 'compatibility', <Cpu size={18}/>)}
                  </div>
               </div>
             </div>
          </div>
        );
      case AppStep.INFRA:
        return (
           <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-900 mb-2">部署架构与信创</h2>
             <p className="text-slate-500 mb-6">高可用规范、硬件选型及成本考量。</p>

             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                     <ShieldCheck size={16} /> 高可用规范 (HA Standard)
                   </label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {renderOption('主备/双机热备', '传统架构，通常RPO>0。', 'basic', data.haRequirement, 'haRequirement', <Server size={18}/>)}
                     {renderOption('同城三副本 (Paxos/Raft)', '同城三机房部署，RPO=0，自动故障切换。', 'paxos_3', data.haRequirement, 'haRequirement', <Server size={18}/>)}
                     {renderOption('两地三中心/异地容灾', '金融级容灾标准，抵御地域级故障。', 'geo_redundancy', data.haRequirement, 'haRequirement', <Server size={18}/>)}
                     {renderOption('本地高可用', '单机房冗余，成本最低。', 'ha_local', data.haRequirement, 'haRequirement', <Server size={18}/>)}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                       <Cpu size={16} /> 信创硬件 (Chipset)
                    </label>
                    <select 
                      value={data.hardwareArch}
                      onChange={(e) => updateData('hardwareArch', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                    >
                      <option value="x86_generic">通用 x86 (Intel/AMD)</option>
                      <option value="kunpeng_arm">鲲鹏/ARM (Huawei Kunpeng)</option>
                      <option value="hygon_x86">海光 x86 (Hygon)</option>
                    </select>
                    <p className="text-xs text-slate-400 mt-2">影响数据库编译版本及性能调优。</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                       <Server size={16} /> 部署模式 (Mode)
                    </label>
                    <select 
                      value={data.deployment}
                      onChange={(e) => updateData('deployment', e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-700"
                    >
                      <option value="onprem_bare_metal">物理机部署 (Bare Metal)</option>
                      <option value="onprem_k8s">私有云/K8s 容器化</option>
                      <option value="cloud_managed">公有云托管 (PaaS)</option>
                      <option value="hybrid_cloud">混合云架构</option>
                    </select>
                  </div>
                </div>
             </div>
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
      {/* Progress Bar */}
      <div className="h-2 bg-slate-100 w-full">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        {renderStepContent()}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <button 
          onClick={onBack}
          className={`px-6 py-2 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
        >
          上一步 (Back)
        </button>
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          {currentStep === AppStep.INFRA ? '生成选型报告' : '下一步 (Next)'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default StepWizard;