import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Globe, 
  Tag, 
  Play, 
  Pause, 
  CheckCircle2, 
  ShieldAlert, 
  Volume2,
  Radio,
  Bot,
  Search,
  BookOpen,
  VolumeX,
  Languages,
  ChevronLeft,
  Plus,
  X,
  Upload,
  Trash2
} from 'lucide-react';
import { retrieveKnowledgeChunk, KNOWLEDGE_CHUNKS } from '../services/knowledgeChunks';

export default function KnowledgeVaultView({ archivedItems = [], onAddArchivedItem, onDeleteArchivedItem, currentUser, onBack }) {
  // Role check: Only Gurus (PRACTITIONER / AUTHORITY) can save/deposit oral composition data
  const isPractitioner = currentUser?.role === 'PRACTITIONER' || currentUser?.role === 'AUTHORITY' || !currentUser?.role;
  const isLearner = currentUser?.role === 'LEARNER';

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [spokenQuery, setSpokenQuery] = useState('');
  const [listeningTime, setListeningTime] = useState(0);
  
  // Knowledge Retrieval Chunk State
  const [retrievedChunk, setRetrievedChunk] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en'); // 'en' | 'mr' | 'hi' | 'pb' | 'gu' | 'ml' | 'as'
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  // Pan-India Archive Playing State
  const [playingId, setPlayingId] = useState(null);

  // Guru Deposit New Composition Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTradition, setNewTradition] = useState('Shahiri Powada');
  const [newPractitioner, setNewPractitioner] = useState(currentUser?.name || 'Guru Shahir Tukaram');
  const [newState, setNewState] = useState('Maharashtra');
  const [newLanguage, setNewLanguage] = useState('Marathi');
  const [newTranscript, setNewTranscript] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Language options matching header selector
  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'pb', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'as', label: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  ];

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLang === 'mr' ? 'mr-IN' : selectedLang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setSpokenQuery(currentTranscript);
        }
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition notice:', err.error);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  // Start Voice Listening
  const startListening = () => {
    setIsListening(true);
    setSpokenQuery('');
    setListeningTime(0);
    setRetrievedChunk(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    timerRef.current = setInterval(() => {
      setListeningTime(prev => prev + 1);
    }, 1000);
  };

  // Stop Listening & Chunk Retrieval from data.md
  const stopListeningAndProcess = (queryText) => {
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const textToSearch = queryText || spokenQuery || "Powada Shahiri Tukaram";
    setSpokenQuery(textToSearch);

    // Retrieve Chunk from data.md
    const chunk = retrieveKnowledgeChunk(textToSearch);
    setRetrievedChunk(chunk);

    // Speak AI Response
    speakAiBotAnswer(chunk, selectedLang);
  };

  // Quick Preset Sample Question click
  const handleSelectPresetQuery = (presetText) => {
    setSpokenQuery(presetText);
    stopListeningAndProcess(presetText);
  };

  // AI Voice Bot Speech Synthesis
  const speakAiBotAnswer = (chunk, langCode) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const targetText = chunk?.languagesAvailable[langCode] || chunk?.languagesAvailable['en'] || "Information retrieved successfully.";
    
    const utterance = new SpeechSynthesisUtterance(targetText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Set voice language code
    if (langCode === 'mr') utterance.lang = 'mr-IN';
    else if (langCode === 'hi') utterance.lang = 'hi-IN';
    else if (langCode === 'pb') utterance.lang = 'pa-IN';
    else if (langCode === 'gu') utterance.lang = 'gu-IN';
    else if (langCode === 'ml') utterance.lang = 'ml-IN';
    else if (langCode === 'as') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-US';

    setIsBotSpeaking(true);
    utterance.onend = () => setIsBotSpeaking(false);
    utterance.onerror = () => setIsBotSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop Bot Speaking
  const stopBotSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsBotSpeaking(false);
  };

  // Handle Language Change
  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    if (retrievedChunk) {
      speakAiBotAnswer(retrievedChunk, newLang);
    }
  };

  // Save Retrieved Voice Record to Pan-India Archive
  const handleSaveRecord = () => {
    if (!retrievedChunk) return;

    const answerText = retrievedChunk.languagesAvailable[selectedLang] || retrievedChunk.languagesAvailable['en'];
    const newItem = {
      id: `kn-${Date.now()}`,
      title: `${retrievedChunk.tradition} (${retrievedChunk.state})`,
      tradition: retrievedChunk.tradition,
      practitioner: currentUser?.name || 'Master Practitioner',
      type: "Voice AI Query & Knowledge Retrieval",
      language: selectedLang.toUpperCase(),
      duration: `${listeningTime > 0 ? listeningTime : 8} secs`,
      date: new Date().toISOString().split('T')[0],
      tags: [retrievedChunk.state, "AI Retrieved", "Voice Archive", "Oral Heritage"],
      consent: selectedConsent,
      transcriptExcerpt: spokenQuery || "Voice Inquiry from User",
      englishTranslation: answerText
    };

    if (onAddArchivedItem) {
      onAddArchivedItem(newItem);
    }

    setRetrievedChunk(null);
    setSpokenQuery('');
  };

  // Guru Deposit New Living Oral Composition Submit Handler
  const handleAddCompositionSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newItem = {
      id: `kn-${Date.now()}`,
      title: newTitle.trim(),
      tradition: newTradition.trim(),
      practitioner: newPractitioner.trim() || (currentUser?.name || 'Guru Master'),
      type: "Guru Deposited Oral Composition",
      language: newLanguage.trim(),
      duration: "14 mins 10 secs",
      date: new Date().toISOString().split('T')[0],
      tags: [newState.trim(), "Guru Composition", "Oral Archive"],
      transcriptExcerpt: newTranscript.trim() || "Oral composition and verse recorded by Guru.",
      englishTranslation: newTranslation.trim() || newTranscript.trim() || "English translation of oral verses."
    };

    if (onAddArchivedItem) {
      onAddArchivedItem(newItem);
    }

    setShowAddModal(false);
    setNewTitle('');
    setNewTranscript('');
    setNewTranslation('');
    setIsSubmitting(false);
    alert(`Successfully deposited "${newItem.title}" into the Pan-India Living Oral Archive!`);
  };

  // Play audio transcript from archive list
  const handlePlayArchiveAudio = (item) => {
    if (playingId === item.id) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    setPlayingId(item.id);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${item.title}. ${item.englishTranslation}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-stone-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <Bot className="w-6 h-6 text-[#104333]" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
              AI Voice Knowledge Assistant & Documentation Vault
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Listen User Voice • AI Knowledge Retrieval • Multilingual Speaking Bot
            </p>
          </div>
        </div>

        {/* Global State Language Selector for Voice Bot */}
        <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200 text-xs font-bold text-stone-800">
          <Languages className="w-4 h-4 text-[#104333] shrink-0" />
          <span>Voice Bot Language:</span>
          <select
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            {languageOptions.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Voice Input Studio */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-center">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-extrabold tracking-wider text-stone-400 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#104333]" />
                <span>Voice Listening Studio</span>
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isListening ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                <Radio className="w-3 h-3" />
                <span>{isListening ? 'Listening Voice...' : 'Mic Ready'}</span>
              </span>
            </div>

            {/* Audio Visualizer & Realtime Transcript Box */}
            <div className="min-h-32 bg-stone-900 rounded-2xl border border-stone-800 p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden text-white shadow-inner">
              {isListening ? (
                <>
                  <div className="flex items-end gap-1.5 h-12 w-full justify-center">
                    {[40, 80, 30, 95, 60, 85, 100, 70, 45, 90, 35, 95, 60, 80, 50, 85].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-red-500 via-amber-400 to-emerald-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-amber-300 font-serif italic text-center px-2">
                    "{spokenQuery || 'Listening to your query... speak now'}"
                  </div>
                </>
              ) : (
                <div className="text-center text-stone-300 space-y-1">
                  <Bot className="w-9 h-9 mx-auto text-amber-400 stroke-1" />
                  <span className="text-xs font-semibold block text-stone-200">
                    Click "Start Voice Listening" & Ask Any Question
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    e.g. "Tell me about Powada", "What is Warli Art?", "Explain Baisakhi Gatka"
                  </span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="font-mono text-xl font-bold text-stone-800 tracking-wider">
              00:{listeningTime < 10 ? `0${listeningTime}` : listeningTime}
            </div>

            {/* Listening Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Start Voice Listening</span>
                </button>
              ) : (
                <button
                  onClick={() => stopListeningAndProcess(spokenQuery)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop & Retrieve Chunk Answer</span>
                </button>
              )}
            </div>

            {/* Sample Voice Question Chips */}
            <div className="pt-3 border-t border-stone-100 text-left space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Or Select Sample Voice Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Tell me about Powada & Shahir Tukaram",
                  "What is Warli Art & Tarpa ritual?",
                  "Explain Baisakhi & Gatka martial art",
                  "What is Bhavai Folk Theatre & Garba?",
                  "Explain Koodiyattam Sanskrit Theatre",
                  "What is Rongali Bihu of Assam?"
                ].map((qText) => (
                  <button
                    key={qText}
                    type="button"
                    onClick={() => handleSelectPresetQuery(qText)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 text-stone-700 font-semibold transition cursor-pointer"
                  >
                    🎤 {qText}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI Bot Output & Chunk Retrieval Card */}
          {retrievedChunk && (
            <div className="bg-white p-6 rounded-3xl border border-amber-300 shadow-md space-y-4 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/20 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                  <Bot className="w-4.5 h-4.5 text-[#104333]" />
                  <span>AI Bot Retrieved Chunk Answer</span>
                </div>
                <div className="flex items-center gap-1">
                  {isBotSpeaking ? (
                    <button
                      onClick={stopBotSpeaking}
                      className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200 cursor-pointer animate-pulse"
                    >
                      <VolumeX className="w-3 h-3" /> Stop Speaking
                    </button>
                  ) : (
                    <button
                      onClick={() => speakAiBotAnswer(retrievedChunk, selectedLang)}
                      className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 cursor-pointer hover:bg-emerald-200"
                    >
                      <Volume2 className="w-3 h-3 text-emerald-700" /> Speak Answer
                    </button>
                  )}
                </div>
              </div>

              {/* Chunk Details */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-cinzel text-sm font-bold text-[#104333]">
                    {retrievedChunk.tradition}
                  </span>
                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-bold">
                    {retrievedChunk.state}
                  </span>
                </div>

                {/* Spoken Answer in Selected Language */}
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    AI Bot Answer ({languageOptions.find(l => l.code === selectedLang)?.label}):
                  </span>
                  <p className="text-stone-900 text-xs mt-1 font-serif leading-relaxed font-semibold">
                    "{retrievedChunk.languagesAvailable[selectedLang] || retrievedChunk.languagesAvailable['en']}"
                  </p>
                </div>
              </div>

              {/* Save Button - ONLY VISIBLE TO GURU / PRACTITIONER / ADMIN */}
              {isPractitioner && (
                <div className="pt-1">
                  <button
                    onClick={handleSaveRecord}
                    className="w-full py-3 rounded-2xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Save Record to Searchable Archive</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right: Pan-India Archive & Retrieved Audio Records */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-bold uppercase text-stone-500 px-1">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#104333]" />
              <span>Archived Living Oral Compositions ({archivedItems.length})</span>
            </span>
            {isPractitioner ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer capitalize"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ Archived Living Oral Compositions</span>
              </button>
            ) : (
              <span className="text-[10px] text-stone-400 font-semibold">Pan-India Archive</span>
            )}
          </div>

          <div className="space-y-4">
            {archivedItems.map((item) => {
              const isCurrentlyPlaying = playingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white p-5 sm:p-6 rounded-3xl border transition-all shadow-2xs space-y-3 ${
                    isCurrentlyPlaying ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-cinzel font-bold text-base text-stone-900 leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-semibold">
                        <span className="text-[#104333] font-bold">{item.practitioner}</span>
                        <span>• {item.tradition}</span>
                        <span>• {item.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handlePlayArchiveAudio(item)}
                        className={`flex items-center justify-center w-10 h-10 rounded-2xl border transition-all cursor-pointer ${
                          isCurrentlyPlaying 
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md animate-pulse' 
                            : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                        }`}
                        title={isCurrentlyPlaying ? "Pause Audio" : "Play Audio Transcript"}
                      >
                        {isCurrentlyPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 ml-0.5 text-[#104333]" />}
                      </button>

                      {isPractitioner && onDeleteArchivedItem && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${item.title}" from the living oral archive?`)) {
                              onDeleteArchivedItem(item.id);
                            }
                          }}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-all cursor-pointer"
                          title="Delete Oral Composition"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
                    <p className="text-stone-900 font-serif italic text-xs sm:text-sm">
                      "{item.transcriptExcerpt}"
                    </p>
                    <p className="text-stone-700 text-xs font-medium">
                      Translation / Answer: "{item.englishTranslation}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-stone-100 text-xs font-medium">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags?.filter(t => t !== 'data.md').map((t, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-stone-700 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200 text-[11px] font-semibold">
                          <Tag className="w-3 h-3 text-[#104333]" />
                          {t}
                        </span>
                      ))}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Guru Deposit New Oral Composition Modal */}
      {showAddModal && isPractitioner && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                  <Plus className="w-5 h-5 text-[#104333]" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-stone-900">Archived Living Oral Compositions</h3>
                  <p className="text-xs text-stone-500 font-medium">Deposit new master oral composition into the Pan-India Archive</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompositionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Composition Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chhatrapati Shivaji Maharaj Ballad - Agindas Verse"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tradition Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Shahiri Powada"
                    value={newTradition}
                    onChange={(e) => setNewTradition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Master Practitioner</label>
                  <input
                    type="text"
                    placeholder="e.g. Guru Shahir Tukaram"
                    value={newPractitioner}
                    onChange={(e) => setNewPractitioner(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Language</label>
                  <input
                    type="text"
                    placeholder="e.g. Marathi"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Oral Transcript / Verses</label>
                <textarea
                  rows="2"
                  placeholder="Enter the native oral verses or composition lyric excerpt..."
                  value={newTranscript}
                  onChange={(e) => setNewTranscript(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-serif italic focus:ring-2 focus:ring-[#104333] outline-hidden"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">English Translation & Explanation</label>
                <textarea
                  rows="2"
                  placeholder="Enter the English translation and heritage context..."
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-[#104333] outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#104333] hover:bg-[#0b3327] text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Archiving...' : 'Deposit to Archive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
