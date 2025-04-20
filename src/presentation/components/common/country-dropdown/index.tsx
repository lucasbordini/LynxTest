import type { Country } from '../../../../data/models/response/corridor-response.js';
import './styles.css';
import { proxy, useSnapshot } from 'valtio';

interface CountryDropdownProps {
  onSelect: (country: Country) => void;
  countries: Country[];
  placeholder?: string;
}

// Creating state with Valtio
const state = proxy({
  isOpen: false,
  selectedCountry: null as Country | null,
});

export function CountryDropdown({
  onSelect,
  countries,
  placeholder,
}: CountryDropdownProps) {
  // Using useSnapshot to get a reactive version of the state
  const { isOpen, selectedCountry } = useSnapshot(state);

  const handleSelect = (country: Country) => {
    state.selectedCountry = country;
    state.isOpen = false;
    onSelect(country);
  };

  return (
    <view className="dropdown-container">
      <view
        className="dropdown-input"
        bindtap={() => (state.isOpen = !state.isOpen)}
      >
        {selectedCountry && selectedCountry.iso2Code && (
          <image
            className="country-flag"
            src={`https://flagcdn.com/48x36/${selectedCountry.iso2Code.toLowerCase()}.png`}
            mode="aspectFill"
          />
        )}
        <text className="dropdown-input-label">
          {selectedCountry ? selectedCountry.name : placeholder}
        </text>
        <text className="dropdown-arrow">▼</text>
      </view>

      {isOpen && (
        <view className="dropdown-sheet">
          <view
            className="county-sheet-overlay"
            bindtap={() => (state.isOpen = false)}
          />
          <view className="country-sheet-content">
            <text className="country-sheet-title">Select a country</text>
            <view className="countries-list">
              <list
                scroll-orientation="vertical"
                list-type="single"
                span-count={1}
                className="countries-list-scroll"
              >
                {countries.map((country, index) => (
                  <list-item
                    item-key={`list-item-${index}`}
                    key={`list-item-${index}`}
                    full-span={true}
                  >
                    <view
                      className="country-list-item"
                      bindtap={() => handleSelect(country)}
                    >
                      {country.iso2Code && (
                        <image
                          className="country-flag"
                          src={`https://flagcdn.com/48x36/${country.iso2Code.toLowerCase()}.png`}
                          mode="aspectFill"
                        />
                      )}
                      <text className="country-item">{country.name}</text>
                    </view>
                  </list-item>
                ))}
              </list>
            </view>
          </view>
        </view>
      )}
    </view>
  );
}
