
import React, { useState, useEffect } from 'react';
import { CaseDetails, VIOLATION_OPTIONS, EVIDENCE_OPTIONS } from '../types';
import { FileText, Calendar, Building, DollarSign, AlertTriangle, Paperclip, Upload, X, HardDrive, Link as LinkIcon, Plus, Check, Camera, ShieldAlert, Zap, Layers, HelpCircle, Info, ArrowRight } from 'lucide-react';
import CollectionCamera from './CollectionCamera';

interface IncidentFormProps {
  onSubmit: (data: CaseDetails) => void;
  isGenerating: boolean;
  initialData: CaseDetails | null;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit, isGenerating, initialData }) => {
  const [formData, setFormData] = useState<CaseDetails>({
    companyName: '',
    companyId: '',
    incidentDate: '',
    employmentStartDate: '',
    monthlySalary: '',
    isDangerousEnvironment: false,
    violations: [],
    targetAgencies: ['laborInspection'], 
    description: '',
    evidenceSelected: [],
    evidenceImages: {},
    evidenceLinks: {}
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [activeCameraCode, setActiveCameraCode] = useState<string | null>(null);
  const [activeLinkCode, setActiveLinkCode] = useState<string | null>(null);
  const [tempLinkValue, setTempLinkValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (violation: string) => {
    setFormData(prev => {
      const exists = prev.violations.includes(violation);
      let newViolations = exists 
        ? prev.violations.filter(v => v !== violation)
        : [...prev.violations, violation];
      
      // 只有在真的有勞保相關違法時，才「建議」開啟
      let newAgencies = [...prev.targetAgencies];
      const isInsuranceRelated = violation.includes('勞保') || violation.includes('投保') || violation.includes('高薪低報') || violation.includes('稅');
      
      if (!exists && isInsuranceRelated) {
        if (!newAgencies.includes('laborInsurance')) newAgencies.push('laborInsurance');
        if (!newAgencies.includes('taxBureau')) newAgencies.push('taxBureau');
      }

      return { ...prev, violations: newViolations, targetAgencies: newAgencies };
    });
  };

  const handleAgencyToggle = (agency: string) => {
    setFormData(prev => {
      const exists = prev.targetAgencies.includes(agency);
      if (exists) {
        return { ...prev, targetAgencies: prev.targetAgencies.filter(a => a !== agency) };
      } else {
        return { ...prev, targetAgencies: [...prev.targetAgencies, agency] };
      }
    });
  };

  const handleEvidenceCheck = (code: string) => {
    setFormData(prev => {
      const exists = prev.evidenceSelected.includes(code);
      if (exists) {
        return { ...prev, evidenceSelected: prev.evidenceSelected.filter(c => c !== code) };
      } else {
        return { ...prev, evidenceSelected: [...prev.evidenceSelected, code] };
      }
    });
  };

  const handleImageUpload = (code: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => {
            const currentImages = prev.evidenceImages[code] || [];
            return {
              ...prev,
              evidenceSelected: prev.evidenceSelected.includes(code) ? prev.evidenceSelected : [...prev.evidenceSelected, code],
              evidenceImages: { ...prev.evidenceImages, [code]: [...currentImages, reader.result as string] }
            };
          });
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleCameraCapture = (code: string, base64: string) => {
    setFormData(prev => {
      const currentImages = prev.evidenceImages[code] || [];
      return {
        ...prev,
        evidenceSelected: prev.evidenceSelected.includes(code) ? prev.evidenceSelected : [...prev.evidenceSelected, code],
        evidenceImages: { ...prev.evidenceImages, [code]: [...currentImages, base64] }
      };
    });
  };

  const confirmAddLink = (code: string) => {
    if (tempLinkValue && tempLinkValue.trim()) {
      setFormData(prev => {
        const currentLinks = prev.evidenceLinks[code] || [];
        return {
          ...prev,
          evidenceSelected: prev.evidenceSelected.includes(code) ? prev.evidenceSelected : [...prev.evidenceSelected, code],
          evidenceLinks: { ...prev.evidenceLinks, [code]: [...currentLinks, tempLinkValue.trim()] }
        };
      });
    }
    setActiveLinkCode(null); setTempLinkValue('');
  };

  const removeImage = (code: string, index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.evidenceImages[code] || [])];
      newImages.splice(index, 1);
      return { ...prev, evidenceImages: { ...prev.evidenceImages, [code]: newImages } };
    });
  };

  const removeLink = (code: string, index: number) => {
    setFormData(prev => {
      const newLinks = [...(prev.evidenceLinks[code] || [])];
      newLinks.splice(index, 1);
      return { ...prev, evidenceLinks: { ...prev.evidenceLinks, [code]: newLinks } };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const salaryValue = parseInt(formData.monthlySalary.replace(/,/g, ''));
  const isSalaryLow = !isNaN(salaryValue) && (
    (salaryValue > 0 && salaryValue < 190) || 
    (salaryValue >= 500 && salaryValue < 28590)
  );

  // 關聯性檢核邏輯：如果使用者勾選了勞保局/國稅局，但「違法事實」裡完全沒提到保費或薪資單
  const hasInsuranceViolations = formData.violations.some(v => v.includes('勞保') || v.includes('投保') || v.includes('高薪低報') || v.includes('稅'));
  const isRequestingInsurance = formData.targetAgencies.includes('laborInsurance') || formData.targetAgencies.includes('taxBureau');
  const showInsuranceInquiry = isRequestingInsurance && !hasInsuranceViolations;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-8 relative z-20 mx-4 md:mx-auto max-w-4xl border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Company Info */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-indigo-600" /> 公司與職務資訊
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">公司全名 *</label>
              <input required name="companyName" value={formData.companyName} onChange={handleChange} placeholder="例如：黑心企業有限公司" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">統一編號 (選填)</label>
              <input name="companyId" value={formData.companyId} onChange={handleChange} placeholder="8碼數字" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">薪資金額 (月薪或時薪) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input required name="monthlySalary" value={formData.monthlySalary} onChange={handleChange} placeholder="例如：35,000 或 180" className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 outline-none transition ${isSalaryLow ? 'border-amber-400 focus:ring-amber-500' : 'border-slate-300 focus:ring-indigo-500'}`} />
              </div>
              {isSalaryLow && (
                <p className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 低於 2025 法定標準 (時薪 190 / 月薪 28590)，AI 將自動列入罪狀。
                </p>
              )}
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">到職日期 *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input required type="date" name="employmentStartDate" value={formData.employmentStartDate} onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Incident Info */}
        <div className="col-span-1 md:col-span-2">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 mt-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> 違法事實勾選
              </h3>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isDangerousEnvironment: !prev.isDangerousEnvironment }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${formData.isDangerousEnvironment ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                <ShieldAlert className={`w-4 h-4 ${formData.isDangerousEnvironment ? 'text-amber-600' : 'text-slate-300'}`} />
                <span className="text-xs font-bold">工作環境具危險性？ {formData.isDangerousEnvironment ? '是' : '否'}</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${formData.isDangerousEnvironment ? 'bg-amber-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${formData.isDangerousEnvironment ? 'left-4.5' : 'left-0.5'}`} />
                </div>
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VIOLATION_OPTIONS.map((option) => (
              <label key={option} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.violations.includes(option) ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                <input type="checkbox" checked={formData.violations.includes(option)} onChange={() => handleCheckboxChange(option)} className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 rounded" />
                <span className={`text-sm ${formData.violations.includes(option) ? 'text-red-800 font-medium' : 'text-slate-600'}`}>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 檢舉管道選擇與智慧建議 */}
        <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-4">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-600" /> 預計發動的檢舉線路
           </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button
               type="button"
               onClick={() => handleAgencyToggle('laborInsurance')}
               className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.targetAgencies.includes('laborInsurance') ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white opacity-60 hover:opacity-100'}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.targetAgencies.includes('laborInsurance') ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Check className={`w-6 h-6 ${formData.targetAgencies.includes('laborInsurance') ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className={`text-sm font-bold ${formData.targetAgencies.includes('laborInsurance') ? 'text-blue-700' : 'text-slate-500'}`}>勞保局</span>
             </button>

             <button
               type="button"
               onClick={() => handleAgencyToggle('laborInspection')}
               className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.targetAgencies.includes('laborInspection') ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white opacity-60 hover:opacity-100'}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.targetAgencies.includes('laborInspection') ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Check className={`w-6 h-6 ${formData.targetAgencies.includes('laborInspection') ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className={`text-sm font-bold ${formData.targetAgencies.includes('laborInspection') ? 'text-amber-700' : 'text-slate-500'}`}>勞檢處</span>
             </button>

             <button
               type="button"
               onClick={() => handleAgencyToggle('taxBureau')}
               className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.targetAgencies.includes('taxBureau') ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white opacity-60 hover:opacity-100'}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.targetAgencies.includes('taxBureau') ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   <Check className={`w-6 h-6 ${formData.targetAgencies.includes('taxBureau') ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className={`text-sm font-bold ${formData.targetAgencies.includes('taxBureau') ? 'text-red-700' : 'text-slate-500'}`}>國稅局</span>
             </button>
          </div>

          {showInsuranceInquiry && (
            <div className="mt-6 p-5 bg-white border-2 border-amber-300 rounded-xl shadow-inner animate-in slide-in-from-top-2 duration-300">
               <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                     <HelpCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-slate-800 text-sm mb-1">智慧關聯性詢問：是否要一併檢舉勞保與稅務？</h4>
                     <p className="text-xs text-slate-600 leading-relaxed mb-4">
                       偵測到您目前的違法事實（如：加班費、職安）未提及「沒保勞保」或「發放不實薪資單」。通常此類案件僅需檢舉「勞檢處」。您確定要發動三線同步檢舉嗎？
                     </p>
                     <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, targetAgencies: prev.targetAgencies.filter(a => a === 'laborInspection') }))}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                        >
                          不，僅檢舉勞檢處
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            // 保持現狀，但關閉提示（這裡透過點擊行為隱含確認）
                            const confirmBox = document.getElementById('insurance-confirm-tag');
                            if (confirmBox) confirmBox.classList.add('hidden');
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          是，我確定要同步檢舉 <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        {/* Evidence Selection */}
        <div className="col-span-1 md:col-span-2">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 mt-2">
            <Paperclip className="w-5 h-5 text-blue-600" /> 持有證據 (蒐證相機、圖片上傳、雲端連結)
          </h3>
           <div className="space-y-4">
            {EVIDENCE_OPTIONS.map((option) => (
              <div key={option.code} className={`p-4 rounded-xl border transition-all ${formData.evidenceSelected.includes(option.code) ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.evidenceSelected.includes(option.code)} onChange={() => handleEvidenceCheck(option.code)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded" />
                    <div>
                      <span className={`block font-bold ${formData.evidenceSelected.includes(option.code) ? 'text-blue-800' : 'text-slate-700'}`}>
                        附件 {option.code}：{option.label.split(' ')[0]}
                      </span>
                      <span className="text-xs text-slate-500">{option.label.split(' ')[1]}</span>
                    </div>
                  </label>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button type="button" onClick={() => setActiveCameraCode(option.code)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm"><Camera className="w-4 h-4" /> 蒐證相機</button>
                    <button type="button" onClick={() => setActiveLinkCode(option.code)} className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border rounded-lg transition ${activeLinkCode === option.code ? 'bg-green-50 border-green-300 text-green-700' : 'text-slate-600 bg-white border-slate-300 hover:bg-slate-50'}`}><HardDrive className={`w-4 h-4 ${activeLinkCode === option.code ? 'text-green-700' : 'text-green-600'}`} /> 連結</button>
                    <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"><Upload className="w-4 h-4 text-blue-600" /> 上傳<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(option.code, e)} /></label>
                  </div>
                </div>
                {activeLinkCode === option.code && (
                  <div className="mb-3 pl-0 sm:pl-8 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                     <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input type="text" value={tempLinkValue} onChange={(e) => setTempLinkValue(e.target.value)} placeholder="請貼上雲端檔案連結..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirmAddLink(option.code); } else if (e.key === 'Escape') { setActiveLinkCode(null); } }} />
                     </div>
                     <button type="button" onClick={() => confirmAddLink(option.code)} disabled={!tempLinkValue.trim()} className={`px-3 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors ${tempLinkValue.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><Check className="w-4 h-4" /> 新增</button>
                  </div>
                )}
                <div className="pl-0 sm:pl-8 space-y-3">
                  {formData.evidenceLinks[option.code]?.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-slate-200 shadow-sm max-w-full group">
                      <LinkIcon className="w-4 h-4 text-green-600 flex-shrink-0" /><a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate flex-1 block">{link}</a>
                      <button type="button" onClick={() => removeLink(option.code, idx)} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {formData.evidenceImages[option.code]?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.evidenceImages[option.code].map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Evidence ${option.code}`} className="w-20 h-20 object-cover rounded-lg border border-slate-300 shadow-sm" />
                          <button type="button" onClick={() => removeImage(option.code, idx)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 mt-4">
            <FileText className="w-5 h-5 text-slate-600" /> 詳細經過描述
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">最近一次發生日期/期間 *</label>
              <input required type="text" name="incidentDate" value={formData.incidentDate} onChange={handleChange} placeholder="例如：2023年10月 至 2024年1月" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
          </div>
          <label className="block text-sm font-medium text-slate-600 mb-1">請描述具體違法情況 *</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="請詳述：公司如何違法？例如「約定月薪4萬，但投保薪資只有27470元」等。" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
        </div>
      </div>

      <div className="sticky bottom-4 z-30">
        <button type="submit" disabled={isGenerating || formData.violations.length === 0 || formData.targetAgencies.length === 0} className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${isGenerating || formData.violations.length === 0 || formData.targetAgencies.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-500/30'}`}>
          {isGenerating ? 'AI 同步撰寫檢舉信中...' : `啟動 AI 生成 ${formData.targetAgencies.length} 份檢舉文案`}
        </button>
      </div>

      {activeCameraCode && <CollectionCamera onCapture={(base64) => handleCameraCapture(activeCameraCode, base64)} onClose={() => setActiveCameraCode(null)} />}
    </form>
  );
};

export default IncidentForm;
