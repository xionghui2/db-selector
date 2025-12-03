import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, AssessmentData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A high-level executive summary in Chinese of the recommendation strategy.",
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the database product (e.g., OceanBase, GaussDB, TiDB, PolarDB, MySQL, etc.)." },
          score: { type: Type.INTEGER, description: "Suitability score from 0 to 100." },
          matchReason: { type: Type.STRING, description: "Detailed explanation in Chinese of why this fits." },
          pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key advantages in Chinese." },
          cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential drawbacks in Chinese." },
          deploymentAdvice: { type: Type.STRING, description: "Advice on HA and deployment in Chinese." },
          xinchuangFit: { type: Type.STRING, description: "Analysis of compatibility with domestic hardware (Kunpeng/Hygon) and Xinchuang standards." },
        },
        required: ["name", "score", "matchReason", "pros", "cons", "deploymentAdvice", "xinchuangFit"],
      },
    },
  },
  required: ["summary", "recommendations"],
};

export const generateDbRecommendation = async (data: AssessmentData): Promise<AnalysisResult> => {
  const prompt = `
    你是一位顶级的中国国产数据库架构师和信创解决方案专家。
    请根据以下客户的具体需求，进行数据库选型评估。

    **1. 业务场景 (Business):**
    - 负载类型: ${data.businessType} (OLTP/OLAP/HTAP)
    - 数据规模: ${data.dataVolume}
    - 并发要求: ${data.concurrency}
    - 未来关注点: ${data.futureFocus} (如：极致稳定、云原生弹性、降本增效、AI自治)

    **2. 技术现状 (Current Status):**
    - 兼容性需求: ${data.compatibility} (Oracle/MySQL/PG)
    - 当前现状: ${data.currentStack} (如：Oracle旧系统迁移、现有OceanBase扩展、MySQL分库分表痛点、新项目)
    
    **3. 部署与信创 (Infra & Xinchuang):**
    - 部署模式: ${data.deployment}
    - 高可用规范: ${data.haRequirement} (如：主备、Paxos三副本、两地三中心)
    - 信创硬件环境: ${data.hardwareArch} (如：通用x86、鲲鹏ARM、海光x86)

    **任务:**
    分析这些输入，推荐 3-4 款适合的数据库产品。
    重点考虑国产化替代（如 OceanBase, TiDB, openGauss/GaussDB, PolarDB, TDSQL, Dameng 等）。
    
    请在分析中包含以下逻辑：
    1. **信创适配度**: 针对 ${data.hardwareArch} 的适配情况。
    2. **高可用满足**: 能否满足 ${data.haRequirement} 的部署架构（如多副本一致性协议）。
    3. **迁移成本**: 基于 ${data.currentStack} 和 ${data.compatibility} 的迁移难度。
    4. **结果生成**: 给出 0-100 的评分，并给出详细的理由（包含成本、技术相似度、业务场景匹配度）。

    请用**中文**回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    throw error;
  }
};