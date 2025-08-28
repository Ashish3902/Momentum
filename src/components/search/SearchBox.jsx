// src/components/search/SearchBox.jsx - Reusable search component
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchAPI } from "../../services/searchAPI";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SearchBox = ({
  initialQuery = "",
  onSearch,
  placeholder = "Search...",
  autoFocus = false,
  showSuggestions = true,
}) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Fetch suggestions with debouncing
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim() || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await searchAPI.getSearchSuggestions(searchQuery, 5);
      const newSuggestions = response.data.data.suggestions || [];
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      setShowSuggestionsList(false);

      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);

    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (suggestions.length > 0 && query.trim()) {
      setShowSuggestionsList(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestionsList(false);
      }
    }, 200);
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Hidden submit button for form submission */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-900 dark:text-white truncate">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && showSuggestionsList && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Getting suggestions...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
