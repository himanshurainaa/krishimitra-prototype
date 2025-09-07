import { Language } from './types';

const englishStrings = {
  // Header
  appTitle: 'Krishi Mitra',
  language: 'Language',
  english: 'English',
  hindi: 'Hindi',
  tamil: 'Tamil',
  telugu: 'Telugu',
  kannada: 'Kannada',
  malayalam: 'Malayalam',
  bengali: 'Bengali',
  marathi: 'Marathi',
  gujarati: 'Gujarati',
  punjabi: 'Punjabi',

  // Dashboard
  aiAssistant: 'AI Assistant',
  plantHealth: 'Plant Health',
  weatherAdvisor: 'Weather Advisor',
  marketPrices: 'Market Prices',
  soilHealthAdvisor: 'Soil Health',
  liveAdvisor: 'Live Advisor',
  backToDashboard: 'Back to Dashboard',

  // Chatbot
  chatbotTitle: 'AI Assistant',
  chatbotPlaceholder: 'Type your question here...',
  send: 'Send',

  // Plant Health
  plantHealthTitle: 'Your Crop Photo',
  uploadInstruction: 'Upload a clear photo of the affected crop for analysis.',
  uploadButton: 'Click to upload',
  analyzing: 'Analyzing your crop...',
  analysisResult: 'Analysis Result',
  analysisAwaits: 'Your Analysis Awaits',
  analysisAwaitsDesc: 'Upload a photo of your crop to see the magic happen here.',
  noImageSelected: 'No image selected.',
  errorPestDetection: 'Could not analyze the image. Please try another one.',

  // Weather Advisor
  weatherAdvisorTitle: '5-Day Weather Forecast & Advice',
  getWeatherAdvice: 'Get 5-Day Weather Advice',
  weatherAdviceFor: 'Weather-based advice for your area:',
  fetchingWeather: 'Fetching weather advice...',
  errorWeather: 'Could not fetch weather advice. Please try again.',
  
  // Market Prices
  marketPricesTitle: 'Market Prices',
  getMarketPrices: 'Get Today\'s Market Prices',
  marketPricesFor: 'Current market prices in your area:',
  fetchingPrices: 'Fetching market prices...',
  errorMarket: 'Could not fetch market prices. Please try again.',
  
  // Soil Health Advisor
  soilHealthAdvisorTitle: 'Soil Health Advisor',
  getSoilAdvice: 'Get Soil Advice',
  soilType: 'Select Soil Type',
  cropName: 'Enter Crop Name',
  cropNamePlaceholder: 'e.g., Tomato, Wheat',
  soilAdviceFor: 'Soil advice for',
  fetchingSoilAdvice: 'Fetching soil advice...',
  errorSoilAdvice: 'Could not fetch soil advice. Please try again.',
  alluvialSoil: 'Alluvial Soil',
  blackSoil: 'Black Soil',
  redSoil: 'Red Soil',
  lateriteSoil: 'Laterite Soil',
  desertSoil: 'Desert Soil',
  mountainSoil: 'Mountain Soil',

  // Live Advisor
  liveAdvisorTitle: 'Live Advisor Session',
  startSession: 'Start Live Session',
  stopSession: 'Stop Session',
  speakNow: 'Speak now...',
  listening: 'Listening...',
  processing: 'Processing...',
  aiSpeaking: 'AI is speaking...',
  errorCameraMic: 'Error accessing camera/microphone. Please check permissions.',
  errorSpeechRecognition: 'Sorry, I could not understand that. Please try again.',
  errorNetwork: 'Network error. Please check your connection and try again.',
  errorNoSpeech: 'No speech was detected. Please try speaking again.',
  errorAudioCapture: 'Could not capture audio. Please check your microphone.',
  errorSpeechSynthesis: 'Could not play the response. Please check your speaker settings.',
  errorNoAiResponse: 'Sorry, I don\'t have a response for that.'
};

export const LOCALIZATION_STRINGS: Record<Language, Record<string, string>> = {
  [Language.EN]: englishStrings,
  [Language.HI]: {
    ...englishStrings,
    // Header
    appTitle: 'कृषि मित्र',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिन्दी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    kannada: 'ಕನ್ನಡ',
    malayalam: 'മലയാളം',
    bengali: 'বাংলা',
    marathi: 'मराठी',
    gujarati: 'ગુજરાતી',
    punjabi: 'ਪੰਜਾਬੀ',

    // Dashboard
    aiAssistant: 'एआई सहायक',
    plantHealth: 'पौध स्वास्थ्य',
    weatherAdvisor: 'मौसम सलाहकार',
    marketPrices: 'मंडी भाव',
    soilHealthAdvisor: 'मृदा स्वास्थ्य',
    liveAdvisor: 'लाइव सलाहकार',
    backToDashboard: 'डैशबोर्ड पर वापस',

    // Chatbot
    chatbotTitle: 'एआई सहायक',
    chatbotPlaceholder: 'अपना सवाल यहां लिखें...',
    send: 'भेजें',

    // Plant Health
    plantHealthTitle: 'आपकी फसल की तस्वीर',
    uploadInstruction: 'विश्लेषण के लिए प्रभावित फसल की एक स्पष्ट तस्वीर अपलोड करें।',
    uploadButton: 'अपलोड करने के लिए क्लिक करें',
    analyzing: 'आपकी फसल का विश्लेषण हो रहा है...',
    analysisResult: 'विश्लेषण परिणाम',
    analysisAwaits: 'आपका विश्लेषण प्रतीक्षित है',
    analysisAwaitsDesc: 'जादू देखने के लिए अपनी फसल की एक तस्वीर अपलोड करें।',
    noImageSelected: 'कोई छवि नहीं चुनी गई।',
    errorPestDetection: 'छवि का विश्लेषण नहीं हो सका। कृपया दूसरी कोशिश करें।',

    // Weather Advisor
    weatherAdvisorTitle: '5-दिवसीय मौसम पूर्वानुमान और सलाह',
    getWeatherAdvice: 'मौसम सलाह प्राप्त करें',
    weatherAdviceFor: 'आपके क्षेत्र के लिए मौसम-आधारित सलाह:',
    fetchingWeather: 'मौसम सलाह प्राप्त हो रही है...',
    errorWeather: 'मौसम सलाह प्राप्त नहीं हो सकी। कृपया पुन: प्रयास करें।',

    // Market Prices
    marketPricesTitle: 'मंडी भाव',
    getMarketPrices: 'आज के मंडी भाव प्राप्त करें',
    marketPricesFor: 'आपके क्षेत्र में वर्तमान मंडी भाव:',
    fetchingPrices: 'मंडी भाव प्राप्त हो रहे हैं...',
    errorMarket: 'मंडी भाव प्राप्त नहीं हो सके। कृपया पुन: प्रयास करें।',

    // Soil Health Advisor
    soilHealthAdvisorTitle: 'मृदा स्वास्थ्य सलाहकार',
    getSoilAdvice: 'मृदा सलाह प्राप्त करें',
    soilType: 'मिट्टी का प्रकार चुनें',
    cropName: 'फसल का नाम दर्ज करें',
    cropNamePlaceholder: 'जैसे, टमाटर, गेहूं',
    soilAdviceFor: 'के लिए मृदा सलाह',
    fetchingSoilAdvice: 'मृदा सलाह प्राप्त हो रही है...',
    errorSoilAdvice: 'मृदा सलाह प्राप्त नहीं हो सकी। कृपया पुन: प्रयास करें।',
    alluvialSoil: 'जलोढ़ मिट्टी',
    blackSoil: 'काली मिट्टी',
    redSoil: 'लाल मिट्टी',
    lateriteSoil: 'लैटेराइट मिट्टी',
    desertSoil: 'रेगिस्तानी मिट्टी',
    mountainSoil: 'पर्वतीय मिट्टी',

    // Live Advisor
    liveAdvisorTitle: 'लाइव सलाहकार सत्र',
    startSession: 'लाइव सत्र शुरू करें',
    stopSession: 'सत्र समाप्त करें',
    speakNow: 'अब बोलें...',
    listening: 'सुन रहा है...',
    processing: 'प्रसंस्करण हो रहा है...',
    aiSpeaking: 'एआई बोल रहा है...',
    errorCameraMic: 'कैमरा/माइक्रोफ़ोन तक पहुँचने में त्रुटि। कृपया अनुमतियाँ जाँचें।',
    errorSpeechRecognition: 'क्षमा करें, मैं समझ नहीं सका। कृपया पुन: प्रयास करें।',
    errorNetwork: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    errorNoSpeech: 'कोई आवाज नहीं मिली। कृपया फिर से बोलने का प्रयास करें।',
    errorAudioCapture: 'ऑडियो कैप्चर नहीं हो सका। कृपया अपना माइक्रोफ़ोन जांचें।',
    errorSpeechSynthesis: 'प्रतिक्रिया नहीं चलाई जा सकी। कृपया अपनी स्पीकर सेटिंग्स जांचें।',
    errorNoAiResponse: 'क्षमा करें, मेरे पास इसके लिए कोई प्रतिक्रिया नहीं है।'
  },
  [Language.TA]: { ...englishStrings, appTitle: 'கிருஷி மித்ரா', tamil: 'தமிழ்' },
  [Language.TE]: { ...englishStrings, appTitle: 'కృషి మిత్ర', telugu: 'తెలుగు' },
  [Language.KN]: { ...englishStrings, appTitle: 'ಕೃಷಿ ಮಿತ್ರ', kannada: 'ಕನ್ನಡ' },
  [Language.ML]: { ...englishStrings, appTitle: 'കൃഷി മിത്ര', malayalam: 'മലയാളം' },
  [Language.BN]: { ...englishStrings, appTitle: 'কৃষি মিত্র', bengali: 'বাংলা' },
  [Language.MR]: { ...englishStrings, appTitle: 'कृषी मित्र', marathi: 'मराठी' },
  [Language.GU]: { ...englishStrings, appTitle: 'કૃષિ મિત્ર', gujarati: 'ગુજરાતી' },
  [Language.PA]: { ...englishStrings, appTitle: 'ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ', punjabi: 'ਪੰਜਾਬੀ' },
};