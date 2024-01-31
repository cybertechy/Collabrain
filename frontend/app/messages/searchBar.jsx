// components/SearchBar.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SearchBar = ({ onSearch }) => {
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
          borderColor: '#972FFF',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#972FFF',
        },
        '&:hover fieldset': {
          borderColor: '#7f22ff',
        },
      },
      '.MuiInputAdornment-root': {
        color: '#972FFF',
      },
      '.MuiInputBase-input': {
        color: '#000000',
      },
    }}>
      <TextField
        fullWidth
        type="search"
        variant="outlined"
        placeholder="Search"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onSearch(e.target.value);
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: '#972FFF', marginRight: 1 }} />
          ),
          endAdornment: searchValue && (
            <IconButton onClick={handleClearSearch}>
              <CloseIcon sx={{ color: '#972FFF' }} />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
