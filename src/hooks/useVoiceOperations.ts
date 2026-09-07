import { useState, useEffect, useRef, useCallback } from 'react';

export interface VoiceOperationsOptions {
  onReloadAll?: () => void;
  onClearAlerts?: () => void;
  onSnapshotConfig?: () => void;
  onToggleTheme?: () => void;
  onToggleSettings?: () => void;
  onFeedback?: (msg: string) => void;
}

export function useVoiceOperations({
  onReloadAll,
  onClearAlerts,
  onSnapshotConfig,
  onToggleTheme,
  onToggleSettings,
  onFeedback
}: VoiceOperationsOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  // Text to speech helper
  const speakFeedback = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore audio playback policy errors in iframes
      }
    }
  }, []);

  const dispatchCommand = useCallback((text: string) => {
    const clean = text.toLowerCase().trim();
    let recognized = false;
    let feedbackMsg = '';

    if (
      clean.includes('reload all') || 
      clean.includes('refresh all') || 
      clean.includes('reload dashboard') || 
      clean.includes('refresh dashboard')
    ) {
      recognized = true;
      feedbackMsg = 'Reloading all services and metrics';
      onReloadAll?.();
    } else if (
      clean.includes('clear alert') || 
      clean.includes('clear alerts') || 
      clean.includes('dismiss alert') || 
      clean.includes('reset alert')
    ) {
      recognized = true;
      feedbackMsg = 'Alerts cleared';
      onClearAlerts?.();
    } else if (
      clean.includes('snapshot') || 
      clean.includes('capture config') || 
      clean.includes('save configuration') || 
      clean.includes('audit file')
    ) {
      recognized = true;
      feedbackMsg = 'System configuration snapshot generated';
      onSnapshotConfig?.();
    } else if (
      clean.includes('toggle theme') || 
      clean.includes('dark mode') || 
      clean.includes('light mode')
    ) {
      recognized = true;
      feedbackMsg = 'Theme toggled';
      onToggleTheme?.();
    } else if (
      clean.includes('open settings') || 
      clean.includes('preferences')
    ) {
      recognized = true;
      feedbackMsg = 'Settings opened';
      onToggleSettings?.();
    }

    if (recognized) {
      setLastCommand(text);
      setLastActionMessage(feedbackMsg);
      speakFeedback(feedbackMsg);
      onFeedback?.(feedbackMsg);
    } else {
      setLastActionMessage(`Unrecognized command: "${text}"`);
    }
  }, [onReloadAll, onClearAlerts, onSnapshotConfig, onToggleTheme, onToggleSettings, onFeedback, speakFeedback]);

  useEffect(() => {
    const SpeechRecognitionClass = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentTranscript += transcriptChunk;
              dispatchCommand(transcriptChunk);
            } else {
              currentTranscript += transcriptChunk;
            }
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone permission blocked or unavailable.');
          } else if (event.error !== 'no-speech') {
            setError(`Voice error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e: any) {
        console.warn('SpeechRecognition initialization error:', e);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [dispatchCommand]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      speakFeedback('Listening for command');
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      // Already running or permission issue
      if (err.name !== 'InvalidStateError') {
        setError('Could not start voice recognition.');
      }
    }
  }, [speakFeedback]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const simulateCommand = useCallback((cmd: string) => {
    setTranscript(cmd);
    dispatchCommand(cmd);
  }, [dispatchCommand]);

  return {
    isListening,
    isSupported,
    transcript,
    lastCommand,
    lastActionMessage,
    error,
    startListening,
    stopListening,
    toggleListening,
    simulateCommand
  };
}
