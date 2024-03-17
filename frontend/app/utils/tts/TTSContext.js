import React, { createContext, useState, useContext, useEffect } from 'react';

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
        if (isTTSEnabled && window.speechSynthesis) {
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
