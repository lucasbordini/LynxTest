import type { Quote } from '../../../data/models/response/quote-response.js';
import { useLocation, useNavigate } from 'react-router';
import SafeViewArea from '../../components/common/safearea/index.jsx';
import './receipt.css';
import { TRANSFER_METHOD_LABELS } from '../../components/quotes/transfer-method-dropdown/index.tsx';

const CHEVRON_LEFT_ICON =
  'https://img.icons8.com/ios-glyphs/30/7a869a/chevron-left.png'; // Example icon
const SAVE_ICON = 'https://img.icons8.com/ios-glyphs/30/7a869a/save.png'; // Example save icon

export function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const quote = location.state?.quote as Quote | undefined;
  if (!quote) return null;
  const send = quote.sendAmount;
  const receive = quote.receiveAmount;
  const total = quote.totalCost;
  const rate = quote.rate;
  const provider = quote.remittanceProvider;
  const method = quote.transferMethod;
  const delivery = quote.deliverySla;
  const adjustments = quote.adjustments || [];

  return (
    <SafeViewArea>
      <view className="receipt-screen-nav-bar">
        <image
          src={CHEVRON_LEFT_ICON}
          className="receipt-screen-nav-back-icon"
          bindtap={() => navigate(-1)} // Use navigate(-1) for back
        />
        <image
          src={SAVE_ICON}
          className="receipt-screen-nav-save-icon" // Use a new class for the save icon
          // Add bindtap if save functionality is needed
        />
      </view>
      <scroll-view
        scroll-orientation="vertical"
        style={{
          width: 'calc(100% - 10px)',
          height: 'calc(100vh - 60px)',
          paddingLeft: '5px',
          borderRadius: '10px',
        }} // Adjust height for nav bar
      >
        <view className="receipt-screen-container">
          <view className="receipt-screen-header">
            <text className="title">Transfer Receipt</text>
            <text className="subtitle">Transaction ID: {quote.id}</text>
          </view>
          <view className="section">
            <text className="section-title">Transfer Details</text>
            <view className="row">
              <text className="label">Provider</text>
              <text className="value">{provider?.name}</text>
            </view>
            <view className="row">
              <text className="label">Transfer Method</text>
              <text className="value">
                {TRANSFER_METHOD_LABELS[quote.transferMethod.id]}
              </text>
            </view>
            <view className="row">
              <text className="label">Delivery SLA</text>
              <text className="value">{delivery?.name}</text>
            </view>
          </view>
          <view className="section">
            <text className="section-title">Amounts</text>
            <view className="row">
              <text className="label">Sent</text>
              <text className="value">
                {send.currency.symbol} {send.value} ({send.currency.iso3Code})
              </text>
            </view>
            <view className="row">
              <text className="label">Received</text>
              <text className="value">
                {receive.currency.symbol} {receive.value} (
                {receive.currency.iso3Code})
              </text>
            </view>
            <view className="row">
              <text className="label">Exchange Rate</text>
              <text className="value">
                1 {send.currency.iso3Code} = {rate} {receive.currency.iso3Code}
              </text>
            </view>
            {adjustments.length > 0 &&
              adjustments.map((adj) => (
                <view className="row" key={adj.id}>
                  <text className="label">{adj.label || adj.name}</text>
                  <text className="value">
                    {adj.value.value} {adj.value.currency.symbol}
                  </text>
                </view>
              ))}
            <view className="total-row">
              <text className="total-label">Total Cost</text>
              <text className="total-value">
                {total.value} {total.currency.symbol}
              </text>
            </view>
          </view>
          <view className="section">
            <text className="section-title">Countries & Currencies</text>
            <view className="row">
              <text className="label">From</text>
              <text className="value">
                {quote.sourceCurrency.name} ({quote.sourceCurrency.iso3Code})
              </text>
            </view>
            <view className="row">
              <text className="label">To</text>
              <text className="value">
                {quote.destinationCountry.name} (
                {quote.destinationCountry.iso3Code})
              </text>
            </view>
            <view className="row">
              <text className="label">Currency</text>
              <text className="value">
                {quote.destinationCurrency.name} (
                {quote.destinationCurrency.iso3Code})
              </text>
            </view>
          </view>
        </view>
      </scroll-view>
    </SafeViewArea>
  );
}
