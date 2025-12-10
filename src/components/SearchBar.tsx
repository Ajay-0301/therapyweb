import React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(0.5, 2),
  marginBottom: theme.spacing(3),
  backgroundColor: '#E0E0E0',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: '#D0D0D0',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  flex: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <StyledPaper elevation={0}>
      <StyledInputBase
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" aria-label="search">
        <SearchIcon />
      </IconButton>
    </StyledPaper>
  );
};

export default SearchBar;