import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Lock, CheckCircle2, Clock, MessageSquare, Sparkles, Calendar, Play, Plus, BookOpen, Video } from 'lucide-react';
import { api } from '../services/api';

export default function ChatModal({ 
  application, 
  currentUser, 
  onClose,
  onStatusChange 
}) {
  const [messages, setMessages] = useState(application?.messages || []);
  const [sessions, setSessions] = useState(application?.sessions || []);
  const [status, setStatus] = useState(application?.status || 'PENDING');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('MESSAGES'); // 'MESSAGES' or 'SESSIONS'
  const messagesEndRef = useRef(null);

  // Session form state
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionTime, setSessionTime] = useState('10:00 AM');
  const [sessionMode, setSessionMode] = useState('Gurukul Offline Residency');
  const [sessionNotes, setSessionNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Role detection: If user's role is not explicitly PRACTITIONER, treat as LEARNER (Shishya)
  const isPractitioner = currentUser?.role === 'PRACTITIONER';
  const isLearner = !isPractitioner;

  const currentUserName = currentUser?.name || (isLearner ? (application?.learnerName || 'Aniket Deshmukh') : (application?.practitionerName || 'Guru'));
  const otherPartyName = isLearner 
    ? (application?.practitionerName || 'Guru') 
    : (application?.learnerName || 'Shishya');
  const traditionName = application?.tradition || 'Living Heritage Tradition';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (application?.id) {
      fetchMessages();
    }
  }, [application?.id]);

  const fetchMessages = async () => {
    if (!application?.id) return;
    try {
      const res = await api.getMessages(application.id);
      if (res.messages) {
        setMessages(res.messages);
      }
      if (res.status) {
        setStatus(res.status);
      }
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    if (status !== 'ACCEPTED') {
      alert('Chat is locked until the Guru approves this apprenticeship request.');
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender: currentUserName,
      senderRole: isLearner ? 'LEARNER' : 'PRACTITIONER',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await api.sendMessage(application.id, {
        sender: tempMsg.sender,
        senderRole: tempMsg.senderRole,
        text: textToSend
      });
      if (res.chatMessage) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.chatMessage : m));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleApprove = async () => {
    try {
      await api.respondToLearnerRequest(application.id, 'ACCEPTED');
      setStatus('ACCEPTED');
      if (onStatusChange) onStatusChange(application.id, 'ACCEPTED');
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  };

  const handleScheduleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!sessionTitle.trim() || isScheduling) return;

    setIsScheduling(true);
    try {
      const res = await api.createSession(application.id, {
        title: sessionTitle,
        date: sessionDate,
        time: sessionTime,
        mode: sessionMode,
        notes: sessionNotes
      });

      if (res.session) {
        setSessions(prev => [res.session, ...prev]);
      }
      setShowSessionModal(false);
      setSessionTitle('');
      setSessionNotes('');
      fetchMessages(); // Refresh automated system message in chat
      setActiveTab('SESSIONS');
    } catch (err) {
      console.error('Error scheduling session:', err);
      alert('Failed to schedule session. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleUpdateSessionStatus = async (sessionId, newStatus) => {
    try {
      await api.updateSessionStatus(application.id, sessionId, newStatus);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col h-[600px] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#2e3e55] text-white p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-bold flex items-center justify-center text-sm shadow-xs">
              {otherPartyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm leading-snug">{otherPartyName}</h3>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  status === 'ACCEPTED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                }`}>
                  {status === 'ACCEPTED' ? '✓ Connected Guru & Shishya' : '⏳ Pending Approval'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {traditionName} Gurukul Mentorship
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-200 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lock Banner if PENDING */}
        {status !== 'ACCEPTED' ? (
          <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isLearner 
                  ? 'Request Sent. Direct chat will unlock once the Guru approves your request.'
                  : 'Pending apprentice request. Approve this request to start chatting.'}
              </span>
            </div>
            {isPractitioner && (
              <button
                onClick={handleApprove}
                className="px-3 py-1 bg-[#133e31] text-white font-bold rounded-lg hover:bg-[#0e2d23] transition text-[11px] shrink-0"
              >
                Approve Now
              </button>
            )}
          </div>
        ) : (
          /* Sub-tabs: Messages vs Learning Sessions */
          <div className="flex items-center justify-between bg-stone-100 px-4 py-2 border-b border-stone-200 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('MESSAGES')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'MESSAGES'
                    ? 'bg-[#133e31] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Messages</span>
              </button>

              <button
                onClick={() => setActiveTab('SESSIONS')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'SESSIONS'
                    ? 'bg-[#133e31] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Gurukul Sessions ({sessions.length})</span>
              </button>
            </div>

            {/* Schedule Session Button - ONLY AVAILABLE TO GURU */}
            {isPractitioner && (
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Session</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 1: Chat Messages */}
        {activeTab === 'MESSAGES' && (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfaf6]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-stone-300" />
                  <p className="text-xs font-medium">No messages yet.</p>
                  {status === 'ACCEPTED' && (
                    <p className="text-[11px] text-stone-500">Send your first message to begin learning!</p>
                  )}
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = (isLearner && msg.senderRole === 'LEARNER') || (isPractitioner && msg.senderRole === 'PRACTITIONER') || (msg.sender === currentUserName);
                  const isSystem = msg.senderRole === 'SYSTEM';

                  if (isSystem) {
                    return (
                      <div key={msg.id || index} className="my-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{msg.text}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-stone-400 mb-1 px-1 font-semibold">
                        {msg.sender} • {msg.senderRole === 'LEARNER' ? 'Shishya' : 'Guru'}
                      </div>

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed ${
                          isMine
                            ? 'bg-[#133e31] text-white rounded-br-none'
                            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>

                      <span className="text-[9px] text-stone-400 mt-1 px-1">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form Footer */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={status !== 'ACCEPTED'}
                placeholder={
                  status === 'ACCEPTED'
                    ? `Type message to ${otherPartyName}...`
                    : "Chat disabled until request is approved..."
                }
                className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
              />

              <button
                type="submit"
                disabled={status !== 'ACCEPTED' || !inputText.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] disabled:bg-stone-300 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </>
        )}

        {/* TAB 2: Learning Sessions List */}
        {activeTab === 'SESSIONS' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50">
            {sessions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 space-y-3">
                <Calendar className="w-10 h-10 text-stone-300" />
                <h4 className="font-bold text-sm text-stone-800">No scheduled sessions yet</h4>
                <p className="text-xs text-stone-500 max-w-xs">
                  {isPractitioner 
                    ? "Schedule your first Gurukul learning session to start lesson topics, practice hours, and live guidance."
                    : "Your Guru has not scheduled any sessions yet. Upcoming learning sessions scheduled by your Guru will appear here."}
                </p>
                {isPractitioner && (
                  <button
                    onClick={() => setShowSessionModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#133e31] text-white font-bold text-xs hover:bg-[#0e2d23] transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule First Session</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((ses) => (
                  <div key={ses.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{ses.title}</h4>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>📅 {ses.date} at {ses.time}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-800">{ses.mode}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        ses.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ses.status === 'IN_PROGRESS'
                          ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}>
                        {ses.status}
                      </span>
                    </div>

                    {ses.notes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                        "{ses.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {ses.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateSessionStatus(ses.id, 'IN_PROGRESS')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Launch Session Room</span>
                        </button>
                      )}

                      {ses.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateSessionStatus(ses.id, 'COMPLETED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: Schedule New Session Form (GURU ONLY) */}
        {showSessionModal && isPractitioner && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
            <form onSubmit={handleScheduleSessionSubmit} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-4 text-stone-800">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Schedule Gurukul Learning Session
                  </h3>
                  <p className="text-xs text-stone-500">
                    Set up lesson topic, time, and mode for {otherPartyName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Lesson Topic / Title:
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="e.g. Lesson 1: Introduction to Powada Daf Rhythms"
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Date:
                    </label>
                    <input
                      type="date"
                      required
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Time:
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      placeholder="10:00 AM"
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Learning Mode:
                  </label>
                  <select
                    value={sessionMode}
                    onChange={(e) => setSessionMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                  >
                    <option value="Gurukul Offline Residency">Gurukul Offline Residency</option>
                    <option value="Online Video Mentorship">Online Video Mentorship</option>
                    <option value="Hybrid Practice & Assignment">Hybrid Practice & Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Lesson Objective / Notes:
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe specific exercises, ballads, or art motifs to practice..."
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="flex-1 py-2.5 rounded-xl bg-[#133e31] hover:bg-[#0e2d23] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isScheduling ? 'Scheduling...' : 'Schedule & Notify'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}


