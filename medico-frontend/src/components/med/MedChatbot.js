import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FiMic, 
  FiMicOff, 
  FiSend, 
  FiVolume2, 
  FiVolumeX, 
  FiTrash2, 
  FiMessageSquare,
  FiLoader,
  FiRadio
} from 'react-icons/fi';
import './MedChatbot.css';

// Use main backend proxy for med API calls (proxied to med backend on 8001)
// Note: WebSocket connections go directly to med backend (8001) as they can't be proxied
const API_BASE_URL = process.env.REACT_APP_MED_API_URL || 'http://localhost:8000/api/med';
const MED_BACKEND_DIRECT = process.env.REACT_APP_MED_BACKEND_DIRECT || 'http://localhost:8001';
const WS_BASE_URL = MED_BACKEND_DIRECT.replace('http', 'ws');

function MedChatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('auto');
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const vadIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (vadIntervalRef.current) {
        clearInterval(vadIntervalRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Send text message
  const sendTextMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Enable question flow for structured medical consultation
      // Get username from localStorage (set during login)
      const username = localStorage.getItem('userEmail') || localStorage.getItem('username') || null;
      
      const response = await axios.post(`${API_BASE_URL}/chat/text`, {
        message: messageToSend,
        session_id: sessionId,
        language: currentLanguage,
        use_question_flow: true,  // Enable structured consultation flow
        username: username  // Send username for MongoDB storage
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp,
        language: response.data.detected_language
      };

      setMessages(prev => [...prev, botMessage]);

      // Play TTS if enabled
      if (isSpeechEnabled) {
        await playTextToSpeech(response.data.response, response.data.detected_language);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMsg = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 503 || error.response.status === 502) {
          errorMsg = 'Medical backend is not running. Please start the med backend on port 8001.';
        } else if (error.response.data?.detail) {
          errorMsg = `Error: ${error.response.data.detail}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMsg = 'Cannot connect to the server. Please check if the backend is running.';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Play text-to-speech
  const playTextToSpeech = async (text, language = 'auto') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tts`,
        {
          message: text,
          session_id: sessionId,
          language: language
        },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error playing TTS:', error);
    }
  };

  // Connect to WebSocket for continuous mode
  const connectWebSocket = () => {
    return new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const ws = new WebSocket(`${WS_BASE_URL}/ws/voice`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        resolve();
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'transcription') {
          const userMessage = {
            role: 'user',
            content: data.text,
            timestamp: new Date().toISOString(),
            language: data.language
          };
          setMessages(prev => [...prev, userMessage]);
          setCurrentTranscription('');
        } else if (data.type === 'response') {
          const botMessage = {
            role: 'assistant',
            content: data.text,
            timestamp: new Date().toISOString(),
            language: data.language
          };
          setMessages(prev => [...prev, botMessage]);
        } else if (data.type === 'tts_audio') {
          if (isSpeechEnabled) {
            const audioData = atob(data.audio);
            const arrayBuffer = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
              arrayBuffer[i] = audioData.charCodeAt(i);
            }
            const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          }
        } else if (data.type === 'error') {
          console.error('WebSocket error:', data.message);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        reject(error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      wsRef.current = ws;
      
      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 5000);
    });
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  // Voice Activity Detection
  const detectVoiceActivity = (analyser) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    const threshold = 30;
    return average > threshold;
  };

  // Start continuous listening mode
  const startContinuousMode = async () => {
    try {
      await connectWebSocket();
      console.log('WebSocket ready, starting continuous mode');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      let isCurrentlyRecording = false;
      let silenceStart = null;
      const SILENCE_DURATION = 1500;
      const MIN_RECORDING_DURATION = 500;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await sendVoiceToWebSocket(audioBlob);
          audioChunksRef.current = [];
        }
      };
      
      vadIntervalRef.current = setInterval(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }
        
        const hasVoice = detectVoiceActivity(analyser);
        
        if (hasVoice) {
          silenceStart = null;
          
          if (!isCurrentlyRecording && mediaRecorder.state === 'inactive') {
            audioChunksRef.current = [];
            mediaRecorder.start();
            isCurrentlyRecording = true;
            setCurrentTranscription('🎤 Listening...');
          }
        } else if (isCurrentlyRecording) {
          if (!silenceStart) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > SILENCE_DURATION) {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
              isCurrentlyRecording = false;
              silenceStart = null;
              setCurrentTranscription('⏳ Processing...');
            }
          }
        }
      }, 100);
      
      setIsContinuousMode(true);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting continuous mode:', error);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (vadIntervalRef.current) {
        clearInterval(vadIntervalRef.current);
        vadIntervalRef.current = null;
      }
      disconnectWebSocket();
      
      if (error.message && error.message.includes('WebSocket')) {
        alert('Could not connect to server. Please ensure the med backend is running on port 8001.');
      } else {
        alert('Could not access microphone. Please check permissions and try again.');
      }
    }
  };

  // Stop continuous listening mode
  const stopContinuousMode = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    
    disconnectWebSocket();
    
    setIsContinuousMode(false);
    setIsRecording(false);
    setCurrentTranscription('');
  };

  // Send audio to WebSocket
  const sendVoiceToWebSocket = async (audioBlob) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result.split(',')[1];
        wsRef.current.send(JSON.stringify({
          type: 'audio_chunk',
          audio: base64Audio
        }));
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error sending audio to WebSocket:', error);
    }
  };

  // Toggle continuous mode
  const toggleContinuousMode = () => {
    if (isContinuousMode) {
      stopContinuousMode();
    } else {
      startContinuousMode();
    }
  };

  // Start recording (one-time mode)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const options = { mimeType: 'audio/webm' };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording (one-time mode)
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send voice message
  const sendVoiceMessage = async (audioBlob) => {
    setIsLoading(true);

    const userMessage = {
      role: 'user',
      content: '🎤 Voice message...',
      timestamp: new Date().toISOString(),
      isVoice: true
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('session_id', sessionId);

      const response = await axios.post(
        `${API_BASE_URL}/chat/voice`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 
          ? { ...msg, content: response.data.transcription }
          : msg
      ));

      const botMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp,
        language: response.data.detected_language
      };
      setMessages(prev => [...prev, botMessage]);

      if (isSpeechEnabled) {
        await playTextToSpeech(response.data.response, response.data.detected_language);
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
      let errorMsg = 'Sorry, I could not process your voice message. Please try again.';
      
      if (error.response) {
        if (error.response.status === 503 || error.response.status === 502) {
          errorMsg = 'Medical backend is not running. Please start the med backend on port 8001.';
        } else if (error.response.data?.detail) {
          errorMsg = `Error: ${error.response.data.detail}`;
        }
      } else if (error.request) {
        errorMsg = 'Cannot connect to the server. Please check if the backend is running.';
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const clearChat = async () => {
    try {
      if (isContinuousMode && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'clear_history' }));
      } else {
        await axios.delete(`${API_BASE_URL}/chat/clear`, {
          data: { session_id: sessionId }
        });
      }
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div className="med-app-container">
      {/* Header */}
      <header className="med-chat-header">
        <div className="med-header-content">
          <FiMessageSquare className="med-header-icon" size={32} />
          <div>
            <h1>Medical Health Assistant</h1>
            <p>Multilingual AI Chatbot with Voice Support</p>
          </div>
        </div>
        <div className="med-header-actions">
          <button
            onClick={toggleContinuousMode}
            className={`med-icon-button ${isContinuousMode ? 'active' : ''}`}
            title={isContinuousMode ? 'Stop Continuous Mode' : 'Start Continuous Mode (Not recommended during structured consultation)'}
            disabled={isLoading && !isContinuousMode}
          >
            {isContinuousMode ? <FiRadio size={20} /> : <FiRadio size={20} />}
          </button>
          <button
            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
            className="med-icon-button"
            title={isSpeechEnabled ? 'Disable TTS' : 'Enable TTS'}
          >
            {isSpeechEnabled ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
          </button>
          <button
            onClick={clearChat}
            className="med-icon-button"
            title="Clear chat"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="med-chat-messages">
        {messages.length === 0 ? (
          <div className="med-welcome-message">
            <FiMessageSquare size={64} className="med-welcome-icon" />
            <h2>Welcome to Medical Consultation! 👋</h2>
            <p>I'll guide you through a structured medical consultation, asking questions one at a time to better understand your health concerns.</p>
            <div className="med-feature-list">
              <div className="med-feature-item">📋 Structured consultation workflow</div>
              <div className="med-feature-item">❓ One question at a time</div>
              <div className="med-feature-item">💬 Type your responses</div>
              <div className="med-feature-item">🌍 Multilingual support</div>
              <div className="med-feature-item">🔒 Confidential and secure</div>
            </div>
            <div className="med-disclaimer">
              <strong>Important:</strong> This is for informational purposes only and does not replace professional medical diagnosis. For emergencies, please seek immediate medical care.
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`med-message ${message.role} med-message-appear`}
            >
              <div className="med-message-content">
                {message.content}
              </div>
              <div className="med-message-meta">
                {new Date(message.timestamp).toLocaleTimeString()}
                {message.language && ` • ${message.language}`}
              </div>
            </div>
          ))
        )}
        {isLoading && !isContinuousMode && (
          <div className="med-message assistant med-message-appear">
            <div className="med-message-content">
              <FiLoader className="med-spinner" size={20} />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        {currentTranscription && (
          <div className="med-message user med-message-appear">
            <div className="med-message-content">
              {currentTranscription}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="med-chat-input-container">
        {isContinuousMode && (
          <div className="med-continuous-mode-indicator">
            <FiRadio size={16} className="med-pulse-icon" />
            <span>Continuous Mode Active - Speak naturally</span>
            {isConnected && <span className="med-connected-dot">●</span>}
          </div>
        )}
        <div className="med-input-wrapper">
          <button
            onClick={isRecording && !isContinuousMode ? stopRecording : startRecording}
            className={`med-voice-button ${isRecording && !isContinuousMode ? 'recording' : ''}`}
            title={isRecording && !isContinuousMode ? 'Stop recording' : 'Start recording'}
            disabled={isLoading || isContinuousMode}
          >
            {isRecording && !isContinuousMode ? <FiMicOff size={24} /> : <FiMic size={24} />}
          </button>
          
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isContinuousMode ? "Continuous mode active - use voice" : "Type your message in any language..."}
            className="med-message-input"
            disabled={isLoading || isRecording || isContinuousMode}
          />
          
          <button
            onClick={sendTextMessage}
            className="med-send-button"
            disabled={!inputMessage.trim() || isLoading || isRecording || isContinuousMode}
            title="Send message"
          >
            <FiSend size={24} />
          </button>
        </div>
        {isRecording && !isContinuousMode && (
          <div className="med-recording-indicator">
            <span className="med-recording-dot"></span>
            Recording... Click microphone to stop
          </div>
        )}
      </div>
    </div>
  );
}

export default MedChatbot;

