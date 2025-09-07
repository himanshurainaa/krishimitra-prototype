import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { getLiveAdvisorResponseStream } from '../services/geminiService';
import VideoIcon from './icons/VideoIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import SwitchCameraIcon from './icons/SwitchCameraIcon';
import CloseIcon from './icons/CloseIcon';
import TranscriptIcon from './icons/TranscriptIcon';

type SessionState = 'idle' | 'listening' | 'processing' | 'speaking';
type ConversationTurn = { speaker: 'user' | 'ai'; text: string };

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any | null = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
}

const StatusIndicator: React.FC<{ state: SessionState; text: string }> = ({ state, text }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-full bg-black/50 backdrop-blur-sm">
            {state === 'listening' && (
                <div className="w-16 h-16 rounded-full bg-green-500/80 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-400 animate-pulse"></div>
                </div>
            )}
            {state === 'processing' && (
                <div className="w-16 h-16 flex items-center justify-center">
                    <SpinnerIcon />
                </div>
            )}
             {state === 'speaking' && (
                <div className="w-16 h-16 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 animate-ping"></div>
                </div>
            )}
            <p className="text-white font-semibold mt-2 text-center">{text}</p>
        </div>
    );
};


const LiveAdvisor: React.FC = () => {
    const { t, language } = useLocalization();
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionState, setSessionState] = useState<SessionState>('idle');
    const [userTranscript, setUserTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [error, setError] = useState('');
    const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recognitionStarting = useRef(false);
    const transcriptPanelRef = useRef<HTMLDivElement>(null);
    const frameCaptureIntervalRef = useRef<number | null>(null);
    const capturedFramesRef = useRef<string[]>([]);

    useEffect(() => {
        if (transcriptPanelRef.current) {
            transcriptPanelRef.current.scrollTop = transcriptPanelRef.current.scrollHeight;
        }
    }, [conversationHistory, isTranscriptVisible]);

    const stopFrameCapture = useCallback(() => {
        if (frameCaptureIntervalRef.current) {
            clearInterval(frameCaptureIntervalRef.current);
            frameCaptureIntervalRef.current = null;
        }
    }, []);

    const startFrameCapture = useCallback(() => {
        stopFrameCapture(); 
        capturedFramesRef.current = [];
        frameCaptureIntervalRef.current = window.setInterval(() => {
            if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 3) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                    capturedFramesRef.current.push(imageData);
                    
                    if (capturedFramesRef.current.length > 5) {
                        capturedFramesRef.current.shift();
                    }
                }
            }
        }, 1000); // Capture one frame per second
    }, [stopFrameCapture]);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const stopRecognition = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, []);

    const stopSession = useCallback(() => {
        stopStream();
        stopRecognition();
        stopFrameCapture();
        window.speechSynthesis.cancel();
        setIsSessionActive(false);
        setSessionState('idle');
        setUserTranscript('');
        setAiResponse('');
        setError('');
        setConversationHistory([]);
        setIsTranscriptVisible(false);
    }, [stopStream, stopRecognition, stopFrameCapture]);

    const startStream = useCallback(async (deviceId?: string) => {
        stopStream();
        try {
            const videoConstraints: MediaTrackConstraints = deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'environment' };
            const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            if (cameraDevices.length === 0) {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDevices(videoDevices);
            }
            return true;
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError(t('errorCameraMic'));
            setIsSessionActive(false);
            return false;
        }
    }, [stopStream, t, cameraDevices.length]);

    const startRecognition = useCallback(() => {
        if (!recognition || recognitionStarting.current) return;
        
        const isCurrentlyListening = sessionState === 'listening';
        if (isCurrentlyListening) {
             console.log("Recognition already running.");
             return;
        }

        recognitionStarting.current = true;
        setError('');
        try {
            recognition.start();
        } catch(e) {
            console.error("Error starting recognition: ", e);
            recognitionStarting.current = false;
        }
    }, [sessionState]);

    const startSession = async () => {
        if (!navigator.onLine) {
            setError(t('errorNetwork'));
            return;
        }
        setAiResponse('');
        setError('');
        const success = await startStream();
        if (success) {
            setIsSessionActive(true);
            setSessionState('listening');
        }
    };
    
    const speakResponse = useCallback((text: string, lang: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!text.trim() || typeof window.speechSynthesis === 'undefined') {
                resolve();
                return;
            }
            window.speechSynthesis.cancel();
    
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            
            utterance.onstart = () => {
                setSessionState('speaking');
            };
    
            utterance.onend = () => {
                resolve();
            };
    
            utterance.onerror = (event) => {
                console.error('SpeechSynthesis Error:', event);
                setError(t('errorSpeechSynthesis'));
                reject(event.error);
            };
    
            setTimeout(() => {
                 window.speechSynthesis.speak(utterance);
            }, 100);
        });
    }, [t]);

    const handleSpeechResult = useCallback(async (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript.trim()) {
            setUserTranscript(finalTranscript);
            setConversationHistory(prev => [...prev, { speaker: 'user', text: finalTranscript.trim() }]);
            stopRecognition();
            stopFrameCapture();
            setSessionState('processing');

            const framesToSend = [...capturedFramesRef.current];
            capturedFramesRef.current = [];

            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;

                if (framesToSend.length === 0) {
                    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                       canvas.width = video.videoWidth;
                       canvas.height = video.videoHeight;
                    }
                    const context = canvas.getContext('2d');
                    if (context) {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
                        framesToSend.push(imageData);
                    } else {
                         setError("Could not process video feed.");
                         setSessionState('listening');
                         return;
                    }
                }

                try {
                    const stream = await getLiveAdvisorResponseStream(framesToSend, finalTranscript);
                    let fullResponse = "";
                    let responseLang: string = language;
                    let isLangCodeParsed = false;
                    setAiResponse('');
                    
                    for await (const chunk of stream) {
                        let chunkText = chunk.text;
                        if(chunkText) {
                            if (!isLangCodeParsed) {
                                const langCodeMatch = chunkText.match(/^\[([a-z]{2,3}-[A-Z]{2})\]\s*/);
                                if (langCodeMatch) {
                                    responseLang = langCodeMatch[1];
                                    chunkText = chunkText.substring(langCodeMatch[0].length);
                                }
                                isLangCodeParsed = true;
                            }
                            fullResponse += chunkText;
                            setAiResponse(prev => prev + chunkText);
                        }
                    }

                    if (fullResponse.trim()) {
                        setConversationHistory(prev => [...prev, { speaker: 'ai', text: fullResponse.trim() }]);
                        await speakResponse(fullResponse, responseLang);
                    } else {
                        const noResponseText = t('errorNoAiResponse');
                        setAiResponse(noResponseText);
                        setConversationHistory(prev => [...prev, { speaker: 'ai', text: noResponseText }]);
                        await speakResponse(noResponseText, responseLang);
                    }
                } catch (err) {
                    console.error("Error getting AI response or speaking:", err);
                    setError(t('errorNetwork'));
                } finally {
                    setAiResponse('');
                    setUserTranscript('');
                    setSessionState('listening');
                }
            }
        }
    }, [language, stopRecognition, speakResponse, t, stopFrameCapture]);
    
    const handleSwitchCamera = useCallback(async () => {
        if (cameraDevices.length < 2) return;
        const nextIndex = (currentCameraIndex + 1) % cameraDevices.length;
        const nextDevice = cameraDevices[nextIndex];
        setCurrentCameraIndex(nextIndex);
        await startStream(nextDevice.deviceId);
    }, [cameraDevices, currentCameraIndex, startStream]);

    // Effect to start recognition when state is 'listening'
    useEffect(() => {
        if(isSessionActive && sessionState === 'listening') {
            startRecognition();
        }
    }, [isSessionActive, sessionState, startRecognition]);

    // Effect to manage recognition event listeners
    useEffect(() => {
        if (!recognition) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        const handleRecognitionError = (event: any) => {
            recognitionStarting.current = false;
            if (event.error === 'no-speech') {
                return;
            }
            let errorMessage = t('errorSpeechRecognition');
            switch (event.error) {
                case 'network': errorMessage = t('errorNetwork'); break;
                case 'audio-capture': errorMessage = t('errorAudioCapture'); break;
                case 'not-allowed': 
                    errorMessage = t('errorCameraMic'); 
                    stopSession(); 
                    break;
            }
            setError(errorMessage);
            if (event.error !== 'not-allowed') {
                 setSessionState('listening');
            }
        };

        const handleRecognitionStart = () => {
            recognitionStarting.current = false;
            if(isSessionActive) setSessionState('listening');
            setError('');
            startFrameCapture();
        };
        
        const handleRecognitionEnd = () => {
            recognitionStarting.current = false;
            if (isSessionActive && sessionState === 'listening') {
                console.log("Recognition ended, restarting.");
                startRecognition();
            }
        };

        recognition.onstart = handleRecognitionStart;
        recognition.onend = handleRecognitionEnd;
        recognition.onerror = handleRecognitionError;
        recognition.onresult = handleSpeechResult;

        return () => {
           if (recognition) {
               recognition.onstart = null;
               recognition.onend = null;
               recognition.onerror = null;
               recognition.onresult = null;
           }
        };
    }, [t, stopSession, startRecognition, sessionState, isSessionActive, handleSpeechResult, startFrameCapture]);

    // Effect to clean up session on component unmount
    useEffect(() => {
        return () => {
           stopSession();
        };
    }, [stopSession]);


    const getStatusText = () => {
        switch(sessionState) {
            case 'listening': return t('listening');
            case 'processing': return t('processing');
            case 'speaking': return t('aiSpeaking');
            default: return '';
        }
    }

    if (!isSessionActive) {
         return (
            <div className="max-w-4xl mx-auto bg-[#1c2e26]/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <VideoIcon className="w-6 h-6 text-green-400"/>
                    <h2 className="text-xl font-bold text-gray-200">{t('liveAdvisorTitle')}</h2>
                </div>
                <button onClick={startSession} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    {t('startSession')}
                </button>
                {error && <p className="text-red-400 font-semibold text-center mt-4">{error}</p>}
            </div>
         );
    }
    
    return (
        <div className="fixed inset-0 bg-black z-50 animate-fade-in">
             <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
                
                {/* Header Controls */}
                <div className="absolute top-0 right-0 p-4">
                    <button onClick={stopSession} className="flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700/80 transition-colors">
                        <CloseIcon /> <span>{t('stopSession')}</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-32">
                    <div className="w-full max-w-4xl text-center space-y-4">
                        <p className="text-2xl text-white/80 font-medium italic min-h-[3rem]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>
                           {userTranscript}
                        </p>
                        <p className="text-3xl md:text-4xl text-white font-bold min-h-[4rem]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>
                           {aiResponse}
                        </p>
                    </div>
                </div>

                {/* Transcript Panel */}
                 <div className={`absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-md transition-transform duration-500 ease-in-out ${isTranscriptVisible ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: 'calc(100% - 100px)'}}>
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">Session Transcript</h3>
                        <button onClick={() => setIsTranscriptVisible(false)}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div ref={transcriptPanelRef} className="p-4 h-[calc(100%-65px)] overflow-y-auto">
                        {conversationHistory.map((turn, index) => (
                            <div key={index} className={`mb-4 ${turn.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block max-w-xl p-3 rounded-2xl ${turn.speaker === 'user' ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <p className="text-sm font-semibold mb-1 capitalize">{turn.speaker === 'ai' ? t('appTitle') : 'You'}</p>
                                    <p>{turn.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Footer Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center">
                    <div className="absolute left-6 flex gap-2">
                        {cameraDevices.length > 1 && (
                            <button onClick={handleSwitchCamera} className="p-4 rounded-full bg-black/50 hover:bg-gray-700/80 text-white transition-colors" aria-label="Switch Camera">
                                <SwitchCameraIcon />
                            </button>
                        )}
                        <button onClick={() => setIsTranscriptVisible(v => !v)} className="p-4 rounded-full bg-black/50 hover:bg-gray-700/80 text-white transition-colors" aria-label="View Transcript">
                            <TranscriptIcon />
                        </button>
                    </div>

                    <StatusIndicator state={sessionState} text={getStatusText()} />
                    
                    <div className="absolute right-6">
                        {error && <p className="text-red-400 font-semibold text-center p-2 bg-black/50 rounded-lg">{error}</p>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LiveAdvisor;