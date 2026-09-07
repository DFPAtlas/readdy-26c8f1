'use client';

import { useState } from 'react';

const DEMO_ANSWERS: Record<string, string> = {
  default: `Based on the uploaded document, here is what I found:\n\n**Key Information Extracted:**\n• Document type: Technical Manual / O&M Document\n• Equipment covered: HVAC / Building Systems\n• Maintenance intervals specified: Monthly, Quarterly, Annual\n\n**Relevant Sections Found:**\n• Section 3.2: Routine Maintenance Procedures\n• Section 5.1: Fault Finding Guide\n• Section 7.4: Spare Parts List\n\n**AI Summary:**\nThis document outlines the operational and maintenance requirements for the specified equipment. Key maintenance tasks include filter replacement (monthly), belt inspection (quarterly), and full service (annual). The fault finding guide covers 15 common fault codes with resolution steps.\n\n**Recommended Actions:**\n• Add maintenance intervals to PPM schedule\n• Order recommended spare parts for stock\n• Share fault codes with engineering team`,
};

export default function AIDocumentAnalysis() {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    setUploaded(file.name);
    setAnswer('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!uploaded) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    setAnswer(DEMO_ANSWERS.default);
    setAnalyzing(false);
  };

  const handleAsk = async () => {
    if (!question.trim() || !uploaded) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    setAnswer(`**Answer to: "${question}"**\n\nBased on the uploaded document "${uploaded}":\n\nThe document addresses this topic in Section 4.3. According to the manufacturer's specifications, the recommended procedure involves:\n\n1. Isolate the system before commencing work\n2. Follow the step-by-step procedure outlined on page 47\n3. Use only approved replacement parts (see parts list Appendix B)\n4. Test system operation after completion\n5. Record all work in the maintenance log\n\n**Safety Note:** Always follow COSHH guidelines and wear appropriate PPE as specified in Section 2.1 of this document.`);
    setAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <i className="ri-file-search-line text-teal-600 text-sm"></i>
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">AI Document Analysis</p>
          <p className="text-xs text-gray-400">Upload manuals, O&M docs, certificates</p>
        </div>
      </div>

      {!uploaded ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
        >
          <i className="ri-upload-cloud-2-line text-3xl text-gray-300 block mb-2"></i>
          <p className="text-sm text-gray-500 mb-1">Drop a document here or</p>
          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
            browse to upload
            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
          <p className="text-xs text-gray-400 mt-2">PDF, Word, TXT — Manuals, O&M docs, SOPs, Certificates</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
            <i className="ri-file-check-line text-green-600"></i>
            <span className="text-sm text-green-700 font-medium flex-1 truncate">{uploaded}</span>
            <button onClick={() => { setUploaded(null); setAnswer(''); }} className="text-gray-400 hover:text-red-500 cursor-pointer">
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <button onClick={handleAnalyze} disabled={analyzing}
              className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 cursor-pointer disabled:opacity-50 whitespace-nowrap">
              {analyzing ? <><i className="ri-loader-4-line animate-spin mr-1"></i>Analysing...</> : <><i className="ri-sparkling-line mr-1"></i>Auto Analyse</>}
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <input value={question} onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask a question about this document..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-400" />
            <button onClick={handleAsk} disabled={!question.trim() || analyzing}
              className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer disabled:opacity-50 whitespace-nowrap">
              Ask
            </button>
          </div>
          {answer && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
              {answer.split('\n').map((line, i) => {
                const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return line.trim() ? <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formatted }} /> : <div key={i} className="h-1" />;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}