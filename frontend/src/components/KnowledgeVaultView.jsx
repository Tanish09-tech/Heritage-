import React, { useState } from 'react';
import { Mic, Square, Sparkles, Globe, Tag, Play, Pause, CheckCircle2, ShieldAlert, Volume2 } from 'lucide-react';

export default function KnowledgeVaultView({ archivedItems, onAddArchivedItem }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showRecordingResult, setShowRecordingResult] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState('Public Educational Access');
  const [isPlaying, setIsPlaying] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
    setShowRecordingResult(false);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerInterval) clearInterval(timerInterval);
    setShowRecordingResult(true);
  };

  const handleSaveToArchive = () => {
    const newItem = {
      id: `kn-${Date.now()}`,
      title: "Shivaji Maharaj Afzal Khan Vadh Ballad (Live Master Recording)",
      tradition: "Shahiri Powada",
      practitioner: "Shahir Tukaramji Kadam",
      type: "Voice Recording + Auto Metadata",
      language: "Marathi (Historical Dialect)",
      duration: `${recordingTime > 0 ? recordingTime : 45} seconds`,
      date: new Date().toISOString().split('T')[0],
      tags: ["Shahiri", "Oral History", "Powada", "Live Recording"],
      consent: selectedConsent,
      transcriptExcerpt: "शिवछत्रपतींचे नाव गाजे, गडकिल्ल्यांवर भगवा साजे... तुंतुन्याची तार वाजे!",
      englishTranslation: "Hear the heroic roar of Chhatrapati Shivaji Maharaj's Powada!"
    };
    onAddArchivedItem(newItem);
    setShowRecordingResult(false);
    setRecordingTime(0);
    alert("🎉 Knowledge Recording Saved & Published to Searchable Archive!");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="clean-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#0f2a4a]" />
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#0f2a4a]">
              AI-Assisted Knowledge Documentation Vault
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Consent-Based Audio Archiving • Speech-to-Text Pipeline • Metadata Auto-Tagging
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Strict Practitioner Consent Verification</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Studio */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          <div className="clean-card p-6 rounded-2xl space-y-4 text-center border-[#0f2a4a]">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Oral Knowledge Studio
            </div>

            {/* Waveform Area */}
            <div className="h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 px-4 relative overflow-hidden">
              {isRecording ? (
                <div className="flex items-end gap-1.5 h-16 w-full justify-center">
                  {[40, 70, 30, 90, 50, 80, 100, 60, 45, 85, 30, 95, 60, 75, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-red-600 to-amber-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 space-y-1">
                  <Volume2 className="w-8 h-8 mx-auto stroke-1 text-slate-400" />
                  <span className="text-xs font-mono block text-slate-500">Click button below to start audio capture</span>
                </div>
              )}
            </div>

            <div className="font-mono text-xl font-bold text-slate-900">
              00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
            </div>

            <div className="flex justify-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs shadow-lg transition"
                >
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span>Start Voice Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Process Audio</span>
                </button>
              )}
            </div>

          </div>

          {/* Result Preview */}
          {showRecordingResult && (
            <div className="clean-card p-6 rounded-2xl space-y-4 border-amber-300 bg-amber-50/40 animate-fadeIn">
              <div className="flex items-center gap-2 text-[#0f2a4a] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#0f2a4a]" />
                <span>AI Speech-to-Text Pipeline Output</span>
              </div>

              <div className="space-y-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Speech-to-Text Transcript (Marathi):</span>
                  <p className="text-slate-900 italic mt-0.5 font-serif">
                    "शिवछत्रपतींचे नाव गाजे, गडकिल्ल्यांवर भगवा साजे... तुंतुन्याची तार वाजे!"
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">English Translation:</span>
                  <p className="text-slate-700 mt-0.5 font-medium">
                    "Hear the heroic roar of Chhatrapati Shivaji Maharaj's Powada!"
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-800 font-bold block">Select Knowledge Access Consent:</label>
                <select
                  value={selectedConsent}
                  onChange={(e) => setSelectedConsent(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="Public Educational Access">Public Educational Access</option>
                  <option value="Verified Community Access">Verified Community Access Only</option>
                  <option value="Apprentice-Only Access">Apprentice-Only Restricted Access</option>
                </select>
              </div>

              <button
                onClick={handleSaveToArchive}
                className="w-full py-2.5 rounded-xl bg-[#0f2a4a] hover:bg-[#091a30] text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Save Record to Searchable Archive</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Archive List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 px-1">
            <span>Archived Living Oral Compositions ({archivedItems.length})</span>
            <span className="text-[10px] text-slate-400">Pan-India Archive</span>
          </div>

          <div className="space-y-4">
            {archivedItems.map((item) => (
              <div
                key={item.id}
                className="clean-card p-5 rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-cinzel font-bold text-base text-slate-900">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-semibold">
                      <span className="text-[#0f2a4a]">{item.practitioner}</span>
                      <span>• {item.tradition}</span>
                      <span>• {item.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPlaying(isPlaying === item.id ? null : item.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition"
                    title="Play Audio"
                  >
                    {isPlaying === item.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-900 font-serif italic">"{item.transcriptExcerpt}"</p>
                  <p className="text-slate-600 text-[11px]">Translation: "{item.englishTranslation}"</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="flex items-center gap-0.5 text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        <Tag className="w-2.5 h-2.5 text-[#0f2a4a]" />
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-600" />
                    {item.consent}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
