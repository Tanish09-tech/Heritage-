import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ் (Tamil)', flag: '🇮🇳' },
];

export const DICTIONARY = {
  en: {
    // Navigation & Roles
    appTitle: 'Sanskriti Suraksha',
    appSubtitle: 'AI-Powered Living Heritage Safeguarding',
    home: 'Home',
    dashboard: 'Dashboard',
    map: 'Heritage Map',
    explorer: 'Traditions Explorer',
    matchmaker: 'Guru-Shishya Matchmaker',
    knowledgeVault: 'Knowledge Vault',
    validationQueue: 'Validation Queue',
    aiInsights: 'AI Heritage Insights',
    settings: 'Profile & Settings',
    shishyaPortal: 'Shishya Portal',
    guruPortal: 'Guru Portal',
    adminPortal: 'Admin Portal',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    selectRole: 'Select Role',
    shishya: 'Shishya (Learner)',
    guru: 'Guru (Master)',
    admin: 'Admin (Authority)',

    // Header & Quick Actions
    searchPlaceholder: 'Search living traditions, masters, or regions...',
    allStates: 'All 9 Focus States',
    selectLanguage: 'Select Language',
    quickRoleSwitch: 'Switch Role',

    // Dashboard & Metrics
    totalMonitored: 'Total Monitored Traditions',
    criticalRisk: 'Critical Risk Practices',
    activeGurus: 'Active Living Gurus',
    activeShishyas: 'Registered Shishyas',
    earlyWarningSystem: 'Living Heritage Early Warning System',
    threatIndex: 'Vulnerability Threat Index',

    // Labels & Form Fields
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth (DOB)',
    state: 'State / Region',
    hobbies: 'Hobbies & Cultural Interests',
    experience: 'Art Form Experience',
    expertTradition: 'Expertise / Tradition',
    email: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember me',
    continue: 'Continue',
    saveChanges: 'Save Profile Changes',
    cancel: 'Cancel',
    close: 'Close',
    viewDetails: 'View Full Dossier',
    applyMentorship: 'Apply for Mentorship',
    addTradition: 'Add / Register Tradition',
    submitValidation: 'Submit Validation',

    // Status Badges
    critical: 'Critical Vulnerability',
    vulnerable: 'Vulnerable',
    strong: 'Thriving / Strong',
    pending: 'Pending Peer Validation',
    verified: 'Verified Archive',

    // General UI Text
    welcomeBack: 'Welcome back',
    languageUpdated: 'Language updated successfully',
  },
  hi: {
    appTitle: 'संस्कृती सुरक्षा',
    appSubtitle: 'एआई-संचालित जीवंत विरासत संरक्षण',
    home: 'मुख्य पृष्ठ',
    dashboard: 'डैशबोर्ड',
    map: 'विरासत मानचित्र',
    explorer: 'परंपरा अन्वेषक',
    matchmaker: 'गुरु-शिष्य मेल मिलाप',
    knowledgeVault: 'ज्ञानकोश पुरालेख',
    validationQueue: 'सत्यापन कतार',
    aiInsights: 'एआई विरासत विश्लेषण',
    settings: 'प्रोफाइल और सेटिंग्स',
    shishyaPortal: 'शिष्य पोर्टल',
    guruPortal: 'गुरु पोर्टल',
    adminPortal: 'प्रशासक पोर्टल',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    logout: 'लॉग आउट',
    selectRole: 'भूमिका चुनें',
    shishya: 'शिष्य (शिक्षार्थी)',
    guru: 'गुरु (उस्ताद / संरक्षक)',
    admin: 'प्रशासक (अधिकारी)',

    searchPlaceholder: 'जीवंत परंपराएं, गुरु या राज्य खोजें...',
    allStates: 'सभी 9 केंद्रित राज्य',
    selectLanguage: 'भाषा चुनें',
    quickRoleSwitch: 'भूमिका बदलें',

    totalMonitored: 'कुल निगमित परंपराएं',
    criticalRisk: 'गंभीर संकटग्रस्त परंपराएं',
    activeGurus: 'सक्रिय जीवंत गुरु',
    activeShishyas: 'पंजीकृत शिष्य',
    earlyWarningSystem: 'जीवंत विरासत पूर्व चेतावनी प्रणाली',
    threatIndex: 'जोखिम सूचकांक',

    fullName: 'पूरा नाम',
    dateOfBirth: 'जन्म तिथि',
    state: 'राज्य / क्षेत्र',
    hobbies: 'रुचियां और सांस्कृतिक क्षेत्र',
    experience: 'कला रूप अनुभव',
    expertTradition: 'विशेषज्ञता / परंपरा',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    continue: 'आगे बढ़ें',
    saveChanges: 'प्रोफाइल सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    viewDetails: 'पूर्ण विवरण देखें',
    applyMentorship: 'मार्गदर्शन के लिए आवेदन करें',
    addTradition: 'नई परंपरा जोड़ें',
    submitValidation: 'सत्यापन जमा करें',

    critical: 'अत्यंत संकटग्रस्त',
    vulnerable: 'संवेदनशील',
    strong: 'समृद्ध / मजबूत',
    pending: 'सत्यापन लंबित',
    verified: 'प्रमाणित अभिलेख',

    welcomeBack: 'पुनः स्वागत है',
    languageUpdated: 'भाषा सफलतापूर्वक बदल दी गई है',
  },
  mr: {
    appTitle: 'संस्कृती सुरक्षा',
    appSubtitle: 'एआय-संचालित जिवंत वारसा संरक्षण प्रणाली',
    home: 'मुख्य पान',
    dashboard: 'डॅशबोर्ड',
    map: 'वारसा नकाशा',
    explorer: 'परंपरा शोध',
    matchmaker: 'गुरु-शिष्य परंपरा मेळावा',
    knowledgeVault: 'ज्ञानकोश संग्रह',
    validationQueue: 'पडताळणी रांग',
    aiInsights: 'एआय वारसा विश्लेषण',
    settings: 'प्रोफाइल आणि सेटिंग्ज',
    shishyaPortal: 'शिष्य पोर्टल',
    guruPortal: 'गुरु पोर्टल',
    adminPortal: 'प्रशासक पोर्टल',
    login: 'लॉग इन करा',
    register: 'नोंदणी करा',
    logout: 'लॉग आउट',
    selectRole: 'भूमिका निवडा',
    shishya: 'शिष्य (विद्यार्थी)',
    guru: 'गुरु (कलावंत / संरक्षक)',
    admin: 'प्रशासक (अधिकारी)',

    searchPlaceholder: 'जिवंत परंपरा, गुरु किंवा राज्य शोधा...',
    allStates: 'सर्व ९ केंद्रित राज्ये',
    selectLanguage: 'भाषा निवडा',
    quickRoleSwitch: 'भूमिका बदला',

    totalMonitored: 'एकूण नोंदणीकृत परंपरा',
    criticalRisk: 'अति-धोक्यात असलेल्या परंपरा',
    activeGurus: 'कार्यरत जिवंत गुरु',
    activeShishyas: 'नोंदणीकृत शिष्य',
    earlyWarningSystem: 'जिवंत वारसा पूर्वसूचना प्रणाली',
    threatIndex: 'धोका निर्देशांक',

    fullName: 'संपूर्ण नाव',
    dateOfBirth: 'जन्म तारीख',
    state: 'राज्य / प्रदेश',
    hobbies: 'छंद आणि सांस्कृतिक आवडी',
    experience: 'कला प्रकाराचा अनुभव',
    expertTradition: 'विशेषज्ञता / कला परंपरा',
    email: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    rememberMe: 'माझी नोंद ठेवा',
    continue: 'पुढे जा',
    saveChanges: 'प्रोफाइल जतन करा',
    cancel: 'रद्द करा',
    close: 'बंद करा',
    viewDetails: 'सविस्तर तपशील पहा',
    applyMentorship: 'गुरु मार्गदर्शनासाठी अर्ज करा',
    addTradition: 'नवीन परंपरा जोडा',
    submitValidation: 'पडताळणी सादर करा',

    critical: 'अत्यंत गंभीर धोका',
    vulnerable: 'संवेदनशील',
    strong: 'समृद्ध / मजबूत',
    pending: 'पडताळणी प्रलंबित',
    verified: 'प्रमाणित संग्रह',

    welcomeBack: 'सुस्वागतम',
    languageUpdated: 'भाषा यशस्वीरीत्या बदलली',
  },
  pa: {
    appTitle: 'ਸੰਸਕ੍ਰਿਤੀ ਸੁਰੱਖਿਆ',
    appSubtitle: 'ਏਆਈ-ਸੰਚਾਲਿਤ ਜੀਵੰਤ ਵਿਰਾਸਤ ਸੰਭਾਲ',
    home: 'ਮੁੱਖ ਪੰਨਾ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    map: 'ਵਿਰਾਸਤ ਨਕਸ਼ਾ',
    explorer: 'ਪਰੰਪਰਾ ਖੋਜ',
    matchmaker: 'ਗੁਰੂ-ਸ਼ਿਸ਼ ਪਰੰਪਰਾ ਮੇਲ',
    knowledgeVault: 'ਗਿਆਨ ਕੋਸ਼',
    validationQueue: 'ਜਾਂਚ ਲਾਈਨ',
    aiInsights: 'ਏਆਈ ਵਿਰਾਸਤ ਵਿਸ਼ਲੇਸ਼ਣ',
    settings: 'ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ',
    shishyaPortal: 'ਸ਼ਿਸ਼ ਪੋਰਟਲ',
    guruPortal: 'ਗੁਰੂ ਪੋਰਟਲ',
    adminPortal: 'ਪ੍ਰਸ਼ਾਸਕ ਪੋਰਟਲ',
    login: 'ਲੌਗ ਇਨ ਕਰੋ',
    register: 'ਰਜਿਸਟਰ ਕਰੋ',
    logout: 'ਲੌਗ ਆਉਟ',
    selectRole: 'ਭੂਮਿਕਾ ਚੁਣੋ',
    shishya: 'ਸ਼ਿਸ਼ (ਸਿੱਖਿਆਰਥੀ)',
    guru: 'ਗੁਰੂ (ਉਸਤਾਦ)',
    admin: 'ਪ੍ਰਸ਼ਾਸਕ (ਅਧਿਕਾਰੀ)',

    searchPlaceholder: 'ਜੀਵੰਤ ਪਰੰਪਰਾਵਾਂ, ਗੁਰੂ ਜਾਂ ਰਾਜ ਖੋਜੋ...',
    allStates: 'ਸਾਰੇ 9 ਕੇਂਦਰਿਤ ਰਾਜ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    quickRoleSwitch: 'ਭੂਮਿਕਾ ਬਦਲੋ',

    totalMonitored: 'ਕੁੱਲ ਨਿਗਰਾਨੀ ਕੀਤੀਆਂ ਪਰੰਪਰਾਵਾਂ',
    criticalRisk: 'ਗੰਭੀਰ ਖਤਰੇ ਵਾਲੀਆਂ ਪਰੰਪਰਾਵਾਂ',
    activeGurus: 'ਸਰਗਰਮ ਗੁਰੂ',
    activeShishyas: 'ਰਜਿਸਟਰਡ ਸ਼ਿਸ਼',
    earlyWarningSystem: 'ਜੀਵੰਤ ਵਿਰਾਸਤ ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ',
    threatIndex: 'ਖਤਰਾ ਸੂਚਕਾਂਕ',

    fullName: 'ਪੂਰਾ ਨਾਮ',
    dateOfBirth: 'ਜਨਮ ਮਿਤੀ',
    state: 'ਰਾਜ / ਖੇਤਰ',
    hobbies: 'ਸ਼ੌਕ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਰੁਚੀਆਂ',
    experience: 'ਕਲਾ ਖੇਤਰ ਦਾ ਤਜ਼ਰਬਾ',
    expertTradition: 'ਮਹਾਰਤ / ਪਰੰਪਰਾ',
    email: 'ਈਮੇਲ ਪਤਾ',
    password: 'ਪਾਸਵਰਡ',
    rememberMe: 'ਯਾਦ ਰੱਖੋ',
    continue: 'ਅੱਗੇ ਵਧੋ',
    saveChanges: 'ਪ੍ਰੋਫਾਈਲ ਸੰਭਾਲੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    close: 'ਬੰਦ ਕਰੋ',
    viewDetails: 'ਪੂਰਾ ਵੇਰਵਾ ਵੇਖੋ',
    applyMentorship: 'ਗੁਰੂ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
    addTradition: 'ਨਵੀਂ ਪਰੰਪਰਾ ਜੋੜੋ',
    submitValidation: 'ਜਾਂਚ ਜਮ੍ਹਾਂ ਕਰੋ',

    critical: 'ਅਤੀ ਗੰਭੀਰ ਖਤਰਾ',
    vulnerable: 'ਸੰਵੇਦਨਸ਼ੀਲ',
    strong: 'ਮਜ਼ਬੂਤ / ਸਮ੍ਰਿਧ',
    pending: 'ਜਾਂਚ ਬਾਕੀ',
    verified: 'ਪ੍ਰਮਾਣਿਤ ਰਿਕਾਰਡ',

    welcomeBack: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    languageUpdated: 'ਭਾਸ਼ਾ ਸਫਲਤਾਪੂਰਵਕ ਬਦਲੀ ਗਈ',
  },
  gu: {
    appTitle: 'સંસ્કૃતિ સુરક્ષા',
    appSubtitle: 'એઆઈ-સંચાલિત જીવંત વારસો સંરક્ષણ',
    home: 'મુખ્ય પૃષ્ઠ',
    dashboard: 'ડેશબોર્ડ',
    map: 'વારસો નકશો',
    explorer: 'પરંપરા શોધ',
    matchmaker: 'ગુરુ-શિષ્ય મેળાપ',
    knowledgeVault: 'જ્ઞાનકોશ',
    validationQueue: 'ચકાસણી કતાર',
    aiInsights: 'એઆઈ વારસો વિશ્લેષણ',
    settings: 'પ્રોફાઇલ અને સેટિંગ્સ',
    shishyaPortal: 'શિષ્ય પોર્ટલ',
    guruPortal: 'ગુરુ પોર્ટલ',
    adminPortal: 'વહીવટકર્તા પોર્ટલ',
    login: 'લૉગ ઇન કરો',
    register: 'નોંધણી કરો',
    logout: 'લૉગ આઉટ',
    selectRole: 'ભૂમિકા પસંદ કરો',
    shishya: 'શિષ્ય (વિદ્યાર્થી)',
    guru: 'ગુરુ (ઉસ્તાદ / વારસદાર)',
    admin: 'વહીવટકર્તા (અધિકારી)',

    searchPlaceholder: 'જીવંત પરંપરાઓ, ગુરુ અથવા રાજ્ય શોધો...',
    allStates: 'તમામ 9 કેન્દ્રિત રાજ્યો',
    selectLanguage: 'ભાષા પસંદ કરો',
    quickRoleSwitch: 'ભૂમિકા બદલો',

    totalMonitored: 'કુલ નિરીક્ષણ હેઠળની પરંપરાઓ',
    criticalRisk: 'ગંભીર જોખમ ધરાવતી પરંપરાઓ',
    activeGurus: 'સક્રિય જીવંત ગુરુઓ',
    activeShishyas: 'નોંધાયેલા શિષ્યો',
    earlyWarningSystem: 'જીવંત વારસો ચેતવણી સિસ્ટમ',
    threatIndex: 'જોખમ સૂચકાંક',

    fullName: 'પૂરું નામ',
    dateOfBirth: 'જન્મ તારીખ',
    state: 'રાજ્ય / પ્રદેશ',
    hobbies: 'રસ અને સાંસ્કૃતિક રુચિઓ',
    experience: 'કલા ક્ષેત્રનો અનુભવ',
    expertTradition: 'નિપુણતા / પરંપરા',
    email: 'ઇમેઇલ સરનામું',
    password: 'પાસવર્ડ',
    rememberMe: 'યાદ રાખો',
    continue: 'આગળ વધો',
    saveChanges: 'પ્રોફાઇલ સાચવો',
    cancel: 'રદ કરો',
    close: 'બંધ કરો',
    viewDetails: 'સંપૂર્ણ વિગતો જુઓ',
    applyMentorship: 'માર્ગદર્શન માટે અરજી કરો',
    addTradition: 'નવી પરંપરા ઉમેરો',
    submitValidation: 'ચકાસણી સબમિટ કરો',

    critical: 'અત્યંત ગંભીર જોખમ',
    vulnerable: 'સંવેદનશીલ',
    strong: 'સમૃદ્ધ / મજબૂત',
    pending: 'ચકાસણી બાકી',
    verified: 'પ્રમાણિત દસ્તાવેજ',

    welcomeBack: 'સુસ્વાગતમ્',
    languageUpdated: 'ભાષા સફળતાપૂર્વક બદલાઈ ગઈ',
  },
  as: {
    appTitle: 'সংস্কৃতি সুৰক্ষা',
    appSubtitle: 'এআই-চালিত জীৱন্ত ঐতিহ্য সংৰক্ষণ',
    home: 'મુખ્ય પૃષ્ઠ',
    dashboard: 'ডেশ্ববৰ্ড',
    map: 'ঐতিহ্য মানচিত্ৰ',
    explorer: 'পৰম্পৰা অন্বেষণ',
    matchmaker: 'গুৰু-শিষ্য পৰম্পৰা মেল',
    knowledgeVault: 'জ্ঞানকোষ সংগ্ৰহ',
    validationQueue: 'সত্যতা নিৰূপণ শাৰী',
    aiInsights: 'এআই ঐতিহ্য বিশ্লেষণ',
    settings: 'প্ৰফাইল আৰু ছেটিংছ',
    shishyaPortal: "শিষ্য প'ৰ্টেল",
    guruPortal: "গুৰু প'ৰ্টেল",
    adminPortal: "প্ৰশাসক প'ৰ্টেল",
    login: 'লগ ইন কৰক',
    register: 'পঞ্জীয়ন কৰক',
    logout: 'লগ আউট',
    selectRole: 'ভূমিকা বাছনি কৰক',
    shishya: 'শিষ্য (শিক্ষাৰ্থী)',
    guru: 'গুৰু (ওস্তাদ / সংৰক্ষক)',
    admin: 'প্ৰশাসক (বিষয়া)',

    searchPlaceholder: 'জীৱন্ত পৰম্পৰা, গুৰু বা ৰাজ্য বিচৰক...',
    allStates: 'সকলো ৯ টা কেন্দ্ৰীভূত ৰাজ্য',
    selectLanguage: 'ভাষা বাছনি কৰক',
    quickRoleSwitch: 'ভূমিকা সলনি কৰক',

    totalMonitored: 'মুঠ নিৰীক্ষণ কৰা পৰম্পৰা',
    criticalRisk: 'অতি সংকটপূৰ্ণ পৰম্পৰা',
    activeGurus: 'সক্ৰিয় জীৱন্ত গুৰু',
    activeShishyas: 'পঞ্জীভূত শিষ্য',
    earlyWarningSystem: 'জীৱন্ত ঐতিহ্য আগতীয়া সকীয়নি ব্যৱস্থা',
    threatIndex: 'সংকট সূচকাংক',

    fullName: 'সম্পূৰ্ণ নাম',
    dateOfBirth: 'জন্ম তারিখ',
    state: 'ৰাজ্য / অঞ্চল',
    hobbies: 'হবি আৰু সাংস্কৃতিক আগ্ৰহ',
    experience: 'কলা ক্ষেত্ৰৰ অভিজ্ঞতা',
    expertTradition: 'বিশেষজ্ঞতা / পৰম্পৰা',
    email: 'ইমেইল ঠিকনা',
    password: 'পাছৱৰ্ড',
    rememberMe: 'মনত ৰাখক',
    continue: 'আগবাঢ়ক',
    saveChanges: 'প্ৰফাইল সংৰক্ষণ কৰক',
    cancel: 'বাতিল কৰক',
    close: 'বন্ধ কৰক',
    viewDetails: 'সম্পূৰ্ণ বিৱৰণ চাওক',
    applyMentorship: 'গুৰু মৰ্গদৰ্শনৰ বাবে আবেদন কৰক',
    addTradition: 'নতুন পৰম্পৰা যোগ কৰক',
    submitValidation: 'সত্যতা দাখিল কৰক',

    critical: 'অতি সংকটপূৰ্ণ',
    vulnerable: 'সংবেদনশীল',
    strong: 'সমৃদ্ধ / শক্তিশালী',
    pending: 'সত্যতা নিৰূপণ বাকী',
    verified: 'প্ৰমাণিত সংগ্ৰহ',

    welcomeBack: 'স্বাগতম',
    languageUpdated: 'ভাষা সফলতাৰে সলনি কৰা হ’ল',
  },
  ml: {
    appTitle: 'സംസ്കൃതി സുരക്ഷ',
    appSubtitle: 'എഐ-അധിഷ്ഠിത ജീവസ്സുറ്റ പൈതൃക സംരക്ഷണം',
    home: 'ഹോം പേജ്',
    dashboard: 'ഡാഷ്ബോർഡ്',
    map: 'പൈതൃക ഭൂപടം',
    explorer: 'പാരമ്പര്യ അന്വേഷണം',
    matchmaker: 'ഗുരു-ശിഷ്യ സംഗമം',
    knowledgeVault: 'ജ്ഞാനകോശ ശേഖരം',
    validationQueue: 'പരിശോധന ക്യൂ',
    aiInsights: 'എഐ പൈതൃക വിശകലനം',
    settings: 'പ്രൊഫൈൽ & ക്രമീകരണങ്ങൾ',
    shishyaPortal: 'ശിഷ്യ പോർട്ടൽ',
    guruPortal: 'ഗുരു പോർട്ടൽ',
    adminPortal: 'അഡ്മിൻ പോർട്ടൽ',
    login: 'ലോഗിൻ ചെയ്യുക',
    register: 'രജിസ്റ്റർ ചെയ്യുക',
    logout: 'ലോഗ് ഔട്ട്',
    selectRole: 'റോൾ തിരഞ്ഞെടുക്കുക',
    shishya: 'ശിഷ്യൻ (വിദ്യാർത്ഥി)',
    guru: 'ഗുരു (ഗുരുനാഥൻ)',
    admin: 'അഡ്മിൻ (ഉദ്യോഗസ്ഥൻ)',

    searchPlaceholder: 'പാരമ്പര്യങ്ങൾ, ഗുരുനാഥന്മാർ അല്ലെങ്കിൽ സംസ്ഥാനങ്ങൾ തിരയുക...',
    allStates: 'എല്ലാ 9 പ്രധാന സംസ്ഥാനങ്ങളും',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    quickRoleSwitch: 'റോൾ മാറ്റുക',

    totalMonitored: 'മൊത്തം നിരീക്ഷിക്കുന്ന പാരമ്പര്യങ്ങൾ',
    criticalRisk: 'ഗുരുതര ഭീഷണിയിലുള്ളവ',
    activeGurus: 'സജീവ ഗുരുനാഥന്മാർ',
    activeShishyas: 'രജിസ്റ്റർ ചെയ്ത ശിഷ്യന്മാർ',
    earlyWarningSystem: 'ജീവസ്സുറ്റ പൈതൃക മുൻകരുതൽ സംവിധാനം',
    threatIndex: 'ഭീഷണി സൂചിക',

    fullName: 'പൂർണ്ണ നാമം',
    dateOfBirth: 'ജനന തീയതി',
    state: 'സംസ്ഥാനം / പ്രദേശം',
    hobbies: 'താല്പര്യങ്ങളും സാംസ്കാരിക അഭിരുചികളും',
    experience: 'കലാ രംഗത്തെ പരിചയം',
    expertTradition: 'നൈപുണ്യം / പാരമ്പര്യം',
    email: 'ഇമെയിൽ വിലാസം',
    password: 'പാസ്‌വേഡ്',
    rememberMe: 'ഓർത്തുവെക്കുക',
    continue: 'തുടരുക',
    saveChanges: 'പ്രൊഫൈൽ സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    close: 'അടയ്ക്കുക',
    viewDetails: 'പൂർണ്ണ വിവരങ്ങൾ കാണുക',
    applyMentorship: 'ഗുരുകുല മാർഗ്ഗനിർദ്ദേശത്തിന് അപേക്ഷിക്കുക',
    addTradition: 'പുതിയ പാരമ്പര്യം ചേർക്കുക',
    submitValidation: 'പരിശോധനയ്ക്ക് സമർപ്പിക്കുക',

    critical: 'അതിഗുരുതര ഭീഷണി',
    vulnerable: 'ഭീഷണി നേരിടുന്നവ',
    strong: 'സജീവം / ശക്തം',
    pending: 'പരിശോധന കാത്തിരിക്കുന്നു',
    verified: 'സാക്ഷ്യപ്പെടുത്തിയത്',

    welcomeBack: 'സ്വാഗതം',
    languageUpdated: 'ഭാഷ വിജയകരമായി മാറ്റി',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('sanskriti_language');
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  // Inject Google Translate script dynamically once
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,mr,pa,gu,as,ml,bn,te,ta',
              autoDisplay: false
            },
            'google_translate_element'
          );
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const addScript = document.createElement('script');
        addScript.id = 'google-translate-script';
        addScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        addScript.async = true;
        document.body.appendChild(addScript);
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    try {
      localStorage.setItem('sanskriti_language', langCode);
    } catch (e) {
      console.error('Failed to save language setting:', e);
    }

    // Trigger Google Translate engine if loaded
    try {
      const selectElem = document.querySelector('.goog-te-combo');
      if (selectElem) {
        selectElem.value = langCode;
        selectElem.dispatchEvent(new Event('change'));
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/`;
        document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/`;
      }
    } catch (err) {
      console.warn('Google translate element update notice:', err);
    }
  };

  // Helper translation function
  const t = (key) => {
    const langDict = DICTIONARY[language] || DICTIONARY.en;
    return langDict[key] || DICTIONARY.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
