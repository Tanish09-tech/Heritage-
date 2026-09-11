import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Lock, CheckCircle2, Clock, MessageSquare, Sparkles, 
  Calendar, Play, Plus, BookOpen, Video, Mic, MicOff, Image, FileText, Paperclip, Volume2 
} from 'lucide-react';
import { api } from '../services/api';
import { 
  joinChatRoom, 
  leaveChatRoom, 
  sendChatMessage, 
  sendTypingStatus, 
  onReceiveMessage, 
  onUserTyping 
} from '../services/socket.js';

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
  const [typingUser, setTypingUser] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('MESSAGES'); // 'MESSAGES' or 'SESSIONS'
  const messagesEndRef = useRef(null);

  // Voice Note Recording & Attachment Menu state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const recordingIntervalRef = useRef(null);

  // Hidden File Inputs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);

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
  }, [messages, typingUser]);

  useEffect(() => {
    if (application?.id) {
      fetchMessages();
      joinChatRoom(application.id);

      onReceiveMessage((newMsg) => {
        if (newMsg) {
          setMessages(prev => {
            const exists = prev.some(m => m.id === newMsg.id || (m.text === newMsg.text && m.sender === newMsg.sender));
            if (exists) {
              return prev.map(m => (m.text === newMsg.text && m.sender === newMsg.sender) ? newMsg : m);
            }
            return [...prev, newMsg];
          });
        }
      });

      onUserTyping(({ sender, isTyping }) => {
        if (sender !== currentUserName) {
          setTypingUser(isTyping ? sender : null);
        }
      });
    }

    return () => {
      if (application?.id) {
        leaveChatRoom(application.id);
      }
    };
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

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    if (application?.id && status === 'ACCEPTED') {
      sendTypingStatus(application.id, currentUserName, val.length > 0);
    }
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
    sendTypingStatus(application.id, currentUserName, false);

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
      const finalMsg = res.chatMessage || tempMsg;
      if (res.chatMessage) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.chatMessage : m));
      }
      // Broadcast over Socket.io
      sendChatMessage(application.id, finalMsg);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Voice Note Handlers
  const startVoiceRecording = () => {
    if (status !== 'ACCEPTED') {
      alert('Chat is locked until the Guru approves this request.');
      return;
    }
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopAndSendVoiceRecording = async () => {
    if (!isRecordingVoice) return;
    clearInterval(recordingIntervalRef.current);
    const durationSec = recordingSeconds > 0 ? recordingSeconds : 6;
    setIsRecordingVoice(false);
    setRecordingSeconds(0);

    const voiceText = `🎙️ Voice Note (${durationSec}s)`;
    const attachment = {
      type: 'voice',
      duration: `${durationSec}s`,
      url: '/audio/sample_voice_note.mp3'
    };

    await sendMediaOrVoiceMessage(voiceText, attachment);
  };

  // File Attachment Handlers
  const handleFileChange = async (e, mediaType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowAttachmentMenu(false);

    const objectUrl = URL.createObjectURL(file);
    const attachment = {
      type: mediaType,
      fileName: file.name,
      url: objectUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    let labelText = `Shared ${mediaType}: ${file.name}`;
    if (mediaType === 'image') labelText = `📷 Shared Image: ${file.name}`;
    if (mediaType === 'video') labelText = `🎥 Shared Video: ${file.name}`;
    if (mediaType === 'document') labelText = `📄 Shared Document: ${file.name}`;

    await sendMediaOrVoiceMessage(labelText, attachment);
  };

  const sendMediaOrVoiceMessage = async (textToSend, attachment = null) => {
    if (status !== 'ACCEPTED' || sending) return;

    sendTypingStatus(application.id, currentUserName, false);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender: currentUserName,
      senderRole: isLearner ? 'LEARNER' : 'PRACTITIONER',
      text: textToSend,
      attachment,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await api.sendMessage(application.id, {
        sender: tempMsg.sender,
        senderRole: tempMsg.senderRole,
        text: textToSend,
        attachment
      });
      const finalMsg = res.chatMessage || tempMsg;
      if (res.chatMessage) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.chatMessage : m));
      }
      sendChatMessage(application.id, finalMsg);
    } catch (err) {
      console.error('Failed to send attachment message:', err);
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
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs leading-relaxed space-y-2 ${
                          isMine
                            ? 'bg-[#133e31] text-white rounded-br-none'
                            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                        }`}
                      >
                        <div>{msg.text}</div>

                        {/* Render Attached Image */}
                        {msg.attachment && msg.attachment.type === 'image' && (
                          <div className="mt-1.5 rounded-xl overflow-hidden border border-stone-200/40 shadow-xs max-w-xs bg-stone-900/10">
                            <img src={msg.attachment.url} alt="Shared image" className="w-full h-40 object-cover rounded-lg" />
                            <div className="p-1.5 text-[10px] font-bold truncate opacity-90">
                              📷 {msg.attachment.fileName}
                            </div>
                          </div>
                        )}

                        {/* Render Attached Video */}
                        {msg.attachment && msg.attachment.type === 'video' && (
                          <div className="mt-1.5 rounded-xl overflow-hidden border border-stone-200/40 shadow-xs max-w-xs bg-stone-900 text-white p-2 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                              <Video className="w-4 h-4 text-emerald-400" />
                              <span>Shared Video Recording</span>
                            </div>
                            <video controls src={msg.attachment.url} className="w-full h-32 rounded-lg object-cover bg-black" />
                            <div className="text-[10px] opacity-80 truncate">{msg.attachment.fileName}</div>
                          </div>
                        )}

                        {/* Render Attached Document */}
                        {msg.attachment && msg.attachment.type === 'document' && (
                          <div className={`mt-1.5 p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                            isMine ? 'bg-emerald-900/40 border-emerald-600/50 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
                          }`}>
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                            <div className="truncate text-[11px]">
                              <span className="font-bold block truncate">{msg.attachment.fileName}</span>
                              <span className="text-[9px] opacity-75">{msg.attachment.size || 'PDF Document'}</span>
                            </div>
                          </div>
                        )}

                        {/* Render Voice Note */}
                        {msg.attachment && msg.attachment.type === 'voice' && (
                          <div className={`mt-1.5 p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                            isMine ? 'bg-emerald-900/50 border-emerald-600/50 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          }`}>
                            <Volume2 className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                            <span className="text-[11px] font-bold">Voice Note ({msg.attachment.duration || '0:12s'})</span>
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-stone-400 mt-1 px-1">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  );
                })
              )}
              {typingUser && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60 animate-pulse">
                  <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" />
                  <span>{typingUser} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Hidden File Inputs */}
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
            <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, 'video')} />
            <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => handleFileChange(e, 'document')} />

            {/* Voice Recording Active Bar */}
            {isRecordingVoice && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center justify-between text-xs text-red-700 font-bold shrink-0 animate-pulse">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-red-600 animate-spin" />
                  <span>Recording Voice Message ({recordingSeconds}s)...</span>
                </div>
                <button
                  type="button"
                  onClick={stopAndSendVoiceRecording}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow-2xs hover:bg-red-700 cursor-pointer"
                >
                  Stop & Send Voice Note
                </button>
              </div>
            )}

            {/* Attachment Menu Popup */}
            {showAttachmentMenu && (
              <div className="absolute bottom-16 left-4 z-40 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 space-y-1 w-52 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Share Media & Files
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded-xl hover:bg-stone-100 flex items-center gap-2 text-xs font-bold text-stone-800 transition cursor-pointer"
                >
                  <Image className="w-4 h-4 text-emerald-600" />
                  <span>Share Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded-xl hover:bg-stone-100 flex items-center gap-2 text-xs font-bold text-stone-800 transition cursor-pointer"
                >
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Share Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded-xl hover:bg-stone-100 flex items-center gap-2 text-xs font-bold text-stone-800 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Share Document</span>
                </button>
              </div>
            )}

            {/* Message Input Form Footer */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0 relative">
              {/* + Attachment Button */}
              <button
                type="button"
                disabled={status !== 'ACCEPTED'}
                onClick={() => setShowAttachmentMenu(prev => !prev)}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 disabled:opacity-50 transition cursor-pointer shrink-0 shadow-2xs"
                title="Share Image, Video, or Document (+)"
              >
                <Plus className="w-4 h-4 text-stone-700" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                disabled={status !== 'ACCEPTED'}
                placeholder={
                  status === 'ACCEPTED'
                    ? `Type message to ${otherPartyName}...`
                    : "Chat disabled until request is approved..."
                }
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
              />

              {/* Mic Voice Button */}
              <button
                type="button"
                disabled={status !== 'ACCEPTED'}
                onClick={isRecordingVoice ? stopAndSendVoiceRecording : startVoiceRecording}
                className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 shadow-2xs ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white border-red-600 animate-bounce'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                }`}
                title={isRecordingVoice ? "Stop & Send Voice Note" : "Send Voice Message"}
              >
                <Mic className="w-4 h-4" />
              </button>

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


