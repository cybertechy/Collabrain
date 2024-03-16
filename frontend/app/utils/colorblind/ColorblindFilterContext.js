import React, { createContext, useState } from 'react';

const ColorblindFilterContext = createContext({
    colorblindFilter: 'none', // Default value
    setColorblindFilter: () => {} // Placeholder function
});

export const ColorblindFilterProvider = ({ children }) => {
    const [colorblindFilter, setColorblindFilter] = useState('none');

    return (
        <ColorblindFilterContext.Provider value={{ colorblindFilter, setColorblindFilter }}>
            {children}
        </ColorblindFilterContext.Provider>
    );
};

export const useColorblindFilter = () => React.useContext(ColorblindFilterContext);
