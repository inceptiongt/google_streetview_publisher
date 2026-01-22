import React, { FormEvent, useCallback, useState } from 'react';
import { MapMouseEvent, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useAutocompleteSuggestions } from '../hooks/use-autocomplete-suggestions';

import '@vis.gl/react-google-maps/examples.css';
import { set } from 'lodash';


interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  setForm: (d: MapMouseEvent) => void;
}

export const AutocompleteCustom = ({ onPlaceSelect, setForm }: Props) => {
  const places = useMapsLibrary('places');

  const [inputValue, setInputValue] = useState<string>('');
  const { suggestions, resetSession } = useAutocompleteSuggestions(inputValue);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: [
          'viewport',
          'location',
          'svgIconMaskURI',
          'iconBackgroundColor'
        ]
      });

      setInputValue('');

      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession();

      onPlaceSelect(place);
      setForm({
        detail: {
          placeId: place.id,
          latLng: {
            lat: place.location?.lat(),
            lng: place.location?.lng()
          }
        }
      } as MapMouseEvent);
    },
    [places, onPlaceSelect]
  );

  return (
    <div className="autocomplete-container">
      <input
        value={inputValue}
        onInput={event => handleInput(event)}
        placeholder="Search for a place"
      />

      {suggestions.length > 0 && (
        <ul className="custom-list">
          {suggestions.map((suggestion, index) => {
            return (
              <li
                key={index}
                className="custom-list-item"
                onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.placePrediction?.text.text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
