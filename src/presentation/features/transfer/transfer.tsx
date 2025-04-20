import './transfer.css';
import SafeViewArea from '../../components/common/safearea/index.jsx';
import { useEffect } from '@lynx-js/react';
import {
  type Currency,
  type Corridor,
  type Country,
} from '../../../data/models/response/corridor-response.js';
import { ErrorBanner } from '../../components/common/error/index.jsx';
import { CountryDropdown } from '../../components/common/country-dropdown/index.jsx';
import { CurrencyField } from '../../components/common/currency-field/index.jsx';
import { transferService } from '../../../data/services/transfer-service.js';
import type { Quote } from '../../../data/models/response/quote-response.js';
import { TransferMethodDropdown } from '../../components/quotes/transfer-method-dropdown/index.jsx';
import { moneyFormatted } from '../../../utils/format.js';
import { proxy, useSnapshot } from 'valtio';
import { PrimaryButton } from '../../components/common/primary-button/index.jsx';
import { useNavigate } from 'react-router';

// Creating store with Valtio
const transferStore = proxy({
  loading: false,
  error: '',
  corridors: undefined as Corridor[] | undefined,
  selectedCountry: null as Country | null,
  sourceCurrency: null as Currency | null,
  destinationCurrency: null as Currency | null,
  sourceAmount: '',
  destinationAmount: '',
  quotes: [] as Quote[],
  selectedQuote: null as Quote | null,
});

export function Transfer() {
  // Using useSnapshot to access reactive state
  const state = useSnapshot(transferStore);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorridors = async () => {
      transferStore.loading = true;
      transferStore.error = '';
      try {
        const fetchedCorridors = await transferService.getCorridors();
        transferStore.corridors = fetchedCorridors;
        console.log('Corridors:', fetchedCorridors);
      } catch (err) {
        transferStore.error =
          'Failed to fetch corridors. Please try again later.';
      } finally {
        transferStore.loading = false;
      }
    };

    fetchCorridors();
  }, []);

  const getCurrencies = (isSource: boolean) => {
    const corridor = transferStore.corridors?.find(
      (c) =>
        c.destinationCountry.iso3Code ===
        transferStore.selectedCountry?.iso3Code,
    );
    if (!corridor) {
      return [];
    }

    return isSource ? corridor.sourceCurrency : corridor.destinationCurrency;
  };

  const fetchQuote = async (amount: string) => {
    if (
      !state.selectedCountry ||
      !state.sourceCurrency ||
      !state.destinationCurrency ||
      state.loading
    ) {
      return;
    }
    if (amount === '' || amount === '000') {
      amount = '1000';
    }
    try {
      transferStore.loading = true;
      const response = await transferService.getQuote(
        amount,
        state.selectedCountry?.iso3Code ?? '',
        state.destinationCurrency?.iso3Code ?? '',
        state.sourceCurrency?.iso3Code ?? '',
      );

      transferStore.quotes = response.quotes ?? [];
      const firstQuote = response.quotes?.[0];
      if (!firstQuote) {
        return;
      }
      transferStore.selectedQuote = firstQuote;
    } catch (err) {
      transferStore.error = 'Failed to fetch quote. Please try again later.';
    } finally {
      transferStore.loading = false;
    }
  };

  const onSourceAmountChange = async (value: string) => {
    transferStore.sourceAmount = value;
    await fetchQuote(value.replace(/\./g, ''));
  };

  const onDestinationAmountChange = async (value: string) => {
    transferStore.destinationAmount = value;
    await fetchQuote(value.replace(/\./g, ''));
  };

  useEffect(() => {
    const handler = async () => {
      await fetchQuote(state.sourceAmount.replace(/\./g, ''));
    };
    handler();
  }, [state.sourceCurrency]);

  useEffect(() => {
    const handler = async () => {
      await fetchQuote(state.destinationAmount.replace(/\./g, ''));
    };
    handler();
  }, [state.destinationCurrency]);

  useEffect(() => {
    if (state.selectedCountry) {
      transferStore.sourceCurrency = null;
      transferStore.destinationCurrency = null;
      transferStore.sourceAmount = '';
      transferStore.destinationAmount = '';
      transferStore.quotes = [];
      transferStore.selectedQuote = null;
    }
  }, [state.selectedCountry]);

  useEffect(() => {
    updateFields();
  }, [state.selectedQuote?.id]);

  const updateFields = () => {
    if (!state.selectedQuote) {
      return;
    }
    transferStore.sourceAmount = moneyFormatted(
      state.selectedQuote.sendAmount.value,
      state.selectedQuote.sendAmount.currency.decimalPlaces,
    ).toFixed(2);
    transferStore.destinationAmount = moneyFormatted(
      state.selectedQuote.receiveAmount.value,
      state.selectedQuote.receiveAmount.currency.decimalPlaces,
    ).toFixed(2);
  };

  return (
    <SafeViewArea>
      <ErrorBanner message={state.error} />
      <view className="transfer-container">
        <text className="title">Start Transfer</text>
        {state.corridors && state.corridors.length > 0 && (
          <view className="section">
            <text className="field-label">Select destination country</text>
            <CountryDropdown
              countries={Array.from(
                new Map(
                  state.corridors.map((c) => [
                    c.destinationCountry.iso3Code,
                    c.destinationCountry,
                  ]),
                ).values(),
              )}
              onSelect={(country) => (transferStore.selectedCountry = country)}
              placeholder={state.selectedCountry?.name ?? 'Select a country'}
            />
          </view>
        )}
        {state.selectedCountry && (
          <view className="section">
            <text className="field-label">You send</text>
            <CurrencyField
              key={state.sourceAmount + state.sourceCurrency?.iso3Code}
              currencies={getCurrencies(true)}
              onChange={(value) => onSourceAmountChange(value)}
              onChangeCurrency={(currency) =>
                (transferStore.sourceCurrency = currency)
              }
              initialValue={state.sourceAmount}
            />
            <text className="field-label">They receive</text>
            <CurrencyField
              key={
                state.destinationAmount + state.destinationCurrency?.iso3Code
              }
              currencies={getCurrencies(false)}
              onChange={(value) => onDestinationAmountChange(value)}
              onChangeCurrency={(currency) =>
                (transferStore.destinationCurrency = currency)
              }
              initialValue={state.destinationAmount}
            />
          </view>
        )}
        {state.quotes.length > 0 && state.selectedQuote && (
          <view className="section">
            <TransferMethodDropdown
              key={state.selectedQuote.id}
              onSelect={(quote) => (transferStore.selectedQuote = quote)}
              quotes={transferStore.quotes}
              selectedQuote={transferStore.selectedQuote}
            />
          </view>
        )}
        <view className="row">
          {state.selectedQuote && (
            <PrimaryButton
              label="Send Transfer"
              isLoading={state.loading}
              onClick={() => {
                navigate('/receipt', { state: { quote: state.selectedQuote } });
              }}
              className="send-transfer-button"
            />
          )}
        </view>
      </view>
    </SafeViewArea>
  );
}
