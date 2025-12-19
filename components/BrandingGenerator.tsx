
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, Loader2, Download, RefreshCw, Palette } from 'lucide-react';

const BrandingGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('A professional and modern logo for a labor rights protection app called "Tri-Guard". The logo should feature a vibrant shield composed of three interlocking glowing bands in vivid blue, amber, and red. Minimalist vector style, legal symbols like a scale subtly integrated, white background, high-end branding.');

  const generateLogo = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setImage(`data:image/png;base64,${base64EncodeString}`);
          break;
        }
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-20 px-4 mb-20">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3" /> AI Branding Tool
            </div>
            <h2 className="text-3xl font-bold text-white">打造專屬形象</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              如果您想為自己的維權行動、工會或自媒體打造更具識別性的品牌形象，可以利用 AI 生成專屬的「三線守護」吉祥物或標誌。
            </p>
            
            <div className="space-y-4">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                rows={3}
              />
              <button
                onClick={generateLogo}
                disabled={isLoading}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
                {isLoading ? '生成視覺形象中...' : '生成 AI 品牌視覺'}
              </button>
            </div>
          </div>

          <div className="w-full md:w-72 aspect-square bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
            {image ? (
              <>
                <img src={image} alt="Generated Branding" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <a 
                     href={image} 
                     download="triguard-brand.png"
                     className="p-3 bg-white rounded-full text-slate-900 hover:bg-indigo-50 transition-colors"
                   >
                     <Download className="w-5 h-5" />
                   </a>
                   <button 
                     onClick={generateLogo}
                     className="p-3 bg-white rounded-full text-slate-900 hover:bg-indigo-50 transition-colors"
                   >
                     <RefreshCw className="w-5 h-5" />
                   </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">生成後將在此顯示您的品牌視覺</p>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                   <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                   <span className="text-xs text-indigo-400 font-bold animate-pulse">正在精煉視覺...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandingGenerator;
