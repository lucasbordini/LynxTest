import { useState, useEffect } from 'react';
import './styles.css';
import type { Currency } from '../../../../data/models/response/corridor-response.js';
import { Input } from '../input/index.jsx';

type Props = {
  initialValue: string;
  currencies: Currency[];
  onChangeCurrency: (currency: Currency) => void;
  onChange: (value: string) => void;
};

export const CurrencyField = ({
  currencies,
  onChange,
  onChangeCurrency,
  initialValue,
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0],
  );
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      const decimalPart = inputValue.split('.')[1] || '';
      const formattedValue = `${Number(inputValue).toFixed(selectedCurrency.decimalPlaces)}`;

      if (decimalPart.length !== selectedCurrency.decimalPlaces) {
        setInputValue(formattedValue);
        onChange(formattedValue);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputValue, selectedCurrency]);

  useEffect(() => {
    onChangeCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const handleInputChange = (value: string) => {
    const formatted = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setInputValue(formatted);
  };

  return (
    <view className="currency-field">
      <Input
        initialValue={inputValue}
        onValueChange={handleInputChange}
        className="currency-input"
      />
      {currencies.length > 1 && (
        <text className="dropdown-button" bindtap={() => setShowPicker(true)}>
          <image src="/assets/ic_arrow_down.svg" />
        </text>
      )}
      {showPicker && (
        <view className="bottom-sheet-overlay">
          <view className="bottom-sheet-container">
            <view className="bottom-sheet-header">
              <text
                className="close-button"
                bindtap={() => setShowPicker(false)}
              >
                ×
              </text>
            </view>
            <view className="currencies-list">
              {currencies.map((currency) => (
                <text
                  key={currency.iso3Code}
                  className="currency-item"
                  bindtap={() => {
                    setSelectedCurrency(currency);
                    setShowPicker(false);
                  }}
                >
                  <text>
                    {currency.name} ({currency.symbol})
                  </text>
                </text>
              ))}
            </view>
          </view>
        </view>
      )}
    </view>
  );
};
