import React, { createContext, useState, useContext, useEffect } from 'react';

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
    const [isTTSEnabled, setIsTTSEnabled] = useState(() => {
        // Check if window is defined to avoid accessing localStorage during server-side rendering
        if (typeof window !== 'undefined') {
            const storedState = localStorage.getItem('isTTSEnabled');
            return storedState !== null ? JSON.parse(storedState) : false;
        }
        return false;
    });

    // Effect to store state in localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isTTSEnabled', JSON.stringify(isTTSEnabled));
        }
    }, [isTTSEnabled]);

    const toggleTTS = () => {
        setIsTTSEnabled(prevState => !prevState);
    };

    const speak = (text) => {
        if (isTTSEnabled && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <TTSContext.Provider value={{ isTTSEnabled, toggleTTS, speak }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => useContext(TTSContext);
