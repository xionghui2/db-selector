export interface AssessmentData {
  // 1. Business Scenario (业务场景)
  businessType: 'oltp' | 'olap' | 'htap' | 'hybrid';
  dataVolume: 'small' | 'medium' | 'large' | 'massive';
  concurrency: 'low' | 'medium' | 'high' | 'extreme';
  
  // 2. Technical Stack & Status (技术现状)
  compatibility: 'mysql' | 'oracle' | 'postgresql' | 'none';
  currentStack: 'oracle_legacy' | 'mysql_sharding' | 'ob_usage' | 'new_project'; // New: Current usage status
  
  // 3. Infrastructure, HA & Xinchuang (部署与信创)
  deployment: 'onprem_bare_metal' | 'onprem_k8s' | 'cloud_managed' | 'hybrid_cloud';
  haRequirement: 'basic' | 'ha_local' | 'paxos_3' | 'geo_redundancy'; // New: HA specifications
  hardwareArch: 'x86_generic' | 'kunpeng_arm' | 'hygon_x86'; // New: Xinchuang hardware
  
  // 4. Future Trend (未来发展)
  futureFocus: 'stability' | 'elasticity' | 'cost' | 'ai_ops'; // New: Strategic focus
}

export interface Recommendation {
  name: string;
  score: number; // 0-100
  matchReason: string;
  pros: string[];
  cons: string[];
  deploymentAdvice: string;
  xinchuangFit: string; // New: Specific comment on Xinchuang compatibility
}

export interface AnalysisResult {
  summary: string;
  recommendations: Recommendation[];
}

export enum AppStep {
  WELCOME = 0,
  SCENARIO = 1,
  TECH = 2,
  INFRA = 3,
  ANALYZING = 4,
  RESULTS = 5,
}