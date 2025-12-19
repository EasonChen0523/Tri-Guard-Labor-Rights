
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { CaseDetails, ReportResult, EVIDENCE_OPTIONS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateReports = async (details: CaseDetails): Promise<ReportResult> => {
  const selectedEvidenceLabels = details.evidenceSelected.map(code => {
      const opt = EVIDENCE_OPTIONS.find(o => o.code === code);
      let label = opt ? `附件${opt.code}: ${opt.label}` : code;
      
      if (details.evidenceLinks[code] && details.evidenceLinks[code].length > 0) {
        label += " (包含雲端連結)";
      }
      return label;
  }).join(", ");

  const prompt = `
    你是一位專業的台灣勞動法律顧問。請根據以下資料撰寫正式檢舉信。

    【案件資料】
    - 公司：${details.companyName} (統編: ${details.companyId || "未知"})
    - 薪資：${details.monthlySalary} (2025 法定：時薪190 / 月薪28590)
    - 違法事實：${details.violations.join(", ")}
    - 具體經過：${details.description}
    - 證據：${selectedEvidenceLabels}
    - 職安環境危險：${details.isDangerousEnvironment ? "是" : "否"}

    【目標單位】
    ${details.targetAgencies.map(a => `- ${a}`).join("\n")}

    【核心指令：未知事實佔位協議 (CRITICAL)】
    若上述資料中缺少關鍵資訊（例如：明確的違法日期、受傷的具體部位、具體被扣金額、具體危險設施名稱等），
    **嚴禁自行編造事實或 Hallucinate (幻覺)**。
    請統一使用「[請在此填寫：(缺失的具體資訊描述)]」作為佔位符。

    【撰寫規範】
    1. 勞檢處：若薪資低於法定標準，必須引用《勞基法》第 21 條。若職安開關為「否」，嚴禁提及職安法。
    2. 勞保局：專注於保費、勞退金扣繳不實。
    3. 國稅局：專注於薪資扣繳憑單金額與實領不符之逃稅行為。
    
    請以 JSON 格式回傳。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            laborInsurance: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
                requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
                submissionGuide: { type: Type.STRING }
              }
            },
            laborInspection: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
                requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
                submissionGuide: { type: Type.STRING }
              }
            },
            taxBureau: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
                requiredDocuments: { type: Type.ARRAY, items: { type: Type.STRING } },
                submissionGuide: { type: Type.STRING }
              }
            },
            evidenceCovers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text?.trim();
    if (!jsonText) throw new Error("Empty response from AI");
    
    const parsed = JSON.parse(jsonText);
    
    if (!details.targetAgencies.includes('laborInsurance')) parsed.laborInsurance = null;
    if (!details.targetAgencies.includes('laborInspection')) parsed.laborInspection = null;
    if (!details.targetAgencies.includes('taxBureau')) parsed.taxBureau = null;

    return {
        ...parsed,
        evidenceImages: details.evidenceImages,
        evidenceLinks: details.evidenceLinks
    } as ReportResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const createLaborLawChat = (projectContext?: string): Chat => {
  let systemInstruction = `你是一位精通台灣勞動法律的 AI 助手。嚴格遵守事實，若資訊不足請提示使用者補充，不要編造。`;
  
  if (projectContext) {
    systemInstruction += `\n\n【目前參考專案上下文】\n${projectContext}\n\n請根據以上專案資料回答使用者的問題。如果使用者詢問有關此案件的建議，請結合上述資料給予具體分析。`;
  }

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};

export { generateReports, createLaborLawChat };
