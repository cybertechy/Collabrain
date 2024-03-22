// components/SearchBar.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';
import { useTTS } from "@/app/utils/tts/TTSContext";

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation('dms');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [searchValue, setSearchValue] = useState('');

  const handleClearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 2,
      '.MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#30475E',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#30475E',
        },
        '&:hover fieldset': {
          borderColor: '#81c3d7',
        },
      },
      '.MuiInputAdornment-root': {
        color: '#30475E',
      },
      '.MuiInputBase-input': {
        color: '#000000',
      },
    }}>
      <TextField
        fullWidth
        type="search"
        variant="outlined"
        placeholder={t('search')}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSearch(e.target.value);
        }}
        onMouseEnter={() => isTTSEnabled && speak("Enter your search request here")}
        onMouseLeave={stop}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#30475E', marginRight: 1 }} />
          ),
          endAdornment: searchValue && (
            <IconButton onClick={handleClearSearch}>
              <CloseIcon sx={{ color: '#30475E' }} />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;