"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '@/app/utils/i18n';

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
    const [isTTSEnabled, setIsTTSEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedState = localStorage.getItem('isTTSEnabled');
            return storedState !== null ? JSON.parse(storedState) : false;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isTTSEnabled', JSON.stringify(isTTSEnabled));
        }
    }, [isTTSEnabled]);

    const toggleTTS = () => {
        setIsTTSEnabled(prevState => !prevState);
    };

    const speak = (text) => {
        // Check if TTS is enabled and the current language is English
        if (isTTSEnabled && window.speechSynthesis && i18n.language.startsWith('en')) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stop = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <TTSContext.Provider value={{ isTTSEnabled, toggleTTS, speak, stop }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => useContext(TTSContext);
