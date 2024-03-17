import React, { createContext, useState, useContext } from 'react';

const TTSContext = createContext();

export const TTSProvider = ({ children }) => {
    const [isTTSEnabled, setIsTTSEnabled] = useState(false);

    const toggleTTS = () => {
        setIsTTSEnabled(!isTTSEnabled);
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