import type { Quote } from '../../../../data/models/response/quote-response.js';
import './styles.css';
import { useState } from '@lynx-js/react';

interface TransferMethodDropdownProps {
  onSelect: (quote: Quote) => void;
  quotes: Quote[];
  selectedQuote: Quote | null;
  placeholder?: string;
}

// Placeholder for a chevron down icon URL - replace with actual asset if available
const CHEVRON_DOWN_ICON =
  'https://img.icons8.com/ios-glyphs/30/000000/chevron-down.png'; // Example icon

export function TransferMethodDropdown({
  onSelect,
  quotes,
  selectedQuote: initialSelectedQuote,
  placeholder = 'Select Transfer Method',
}: TransferMethodDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(
    initialSelectedQuote,
  );

  const handleSelect = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsOpen(false);
    onSelect(quote);
  };

  return (
    <view className="transfer-dropdown-container">
      <view
        className="transfer-dropdown-input"
        bindtap={() => setIsOpen(!isOpen)}
      >
        <view className="transfer-dropdown-input-text">
          <text className="transfer-dropdown-input-title">
            {selectedQuote
              ? TRANSFER_METHOD_LABELS[selectedQuote.transferMethod.id] ||
                selectedQuote.transferMethod.name
              : placeholder}
          </text>
          <text className="transfer-dropdown-input-subtitle">
            {selectedQuote
              ? `1 ${selectedQuote.sendAmount.currency.iso3Code} = ${selectedQuote.rate} ${selectedQuote.receiveAmount.currency.iso3Code}`
              : ''}
          </text>
        </view>
        <image src={CHEVRON_DOWN_ICON} className="transfer-dropdown-chevron" />
      </view>

      {isOpen && (
        <view className="transfer-dropdown-sheet">
          <view className="sheet-overlay" bindtap={() => setIsOpen(false)} />
          <view className="sheet-content">
            <text className="sheet-title">Select your quote</text>
            <view className="quotes-list">
              <list
                scroll-orientation="vertical"
                list-type="single"
                span-count={1}
                className="quotes-list-scroll"
              >
                {quotes.map((quote, index) => (
                  <list-item
                    item-key={`quote-item-${index}`}
                    key={`quote-item-${index}`}
                    full-span={true}
                  >
                    <view
                      className={`quote-item ${quote.id === selectedQuote?.id ? 'selected' : ''}`}
                      bindtap={() => handleSelect(quote)}
                    >
                      <view className="quote-item-text">
                        <text className="quote-item-title">
                          {TRANSFER_METHOD_LABELS[quote.transferMethod.id] ||
                            quote.transferMethod.name}
                        </text>
                        <text className="quote-item-subtitle">{`1 ${quote.sendAmount.currency.iso3Code} = ${quote.rate} ${quote.receiveAmount.currency.iso3Code}`}</text>
                      </view>
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

export const TRANSFER_METHOD_LABELS: Record<string, string> = {
  CASH_PICKUP: 'Cash pickup',
  PUSH_TO_CARD: 'Deposit via debit card',
  BANK_ACCOUNT: 'Bank transfer',
  MOBILE_WALLET: 'Mobile wallet',
};
