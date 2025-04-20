export interface QuoteResponse {
  errors?: ErrorResponse[];
  quotes?: Quote[];
}

export interface ErrorResponse {
  code: string;
  message: string;
  details: ErrorDetails;
}

export interface ErrorDetails {
  RemittanceProvider: string;
  TransferMethod: string;
  QuoteBy: string;
}

export interface Quote {
  adjustments: Adjustment[];
  deliverySla: DeliverySla;
  destinationCountry: Country;
  destinationCurrency: Currency;
  disclosures: any[];
  id: string;
  fields: Field[];
  quoteBy: QuoteBy;
  rate: number;
  receiveAmount: MoneyValue;
  remittanceProvider: RemittanceProvider;
  sendAmount: MoneyValue;
  sourceCurrency: Currency;
  totalCost: MoneyValue;
  transferMethod: TransferMethod;
}

export interface Adjustment {
  label: string;
  id: string;
  name: string;
  type: string;
  value: MoneyValue;
}

export interface DeliverySla {
  id: string;
  name: string;
}

export interface Country {
  name: string;
  iso3Code: string;
  iso2Code: string;
}

export interface Currency {
  name: string;
  iso3Code: string;
  symbol: string;
  decimalPlaces: number;
  roundDirection: string;
  iso4217Code: string;
}

export interface Field {
  id: string;
  type: string;
  value: FieldValue;
}

export interface FieldValue {
  fieldType: string;
  value: number;
  currency?: Currency;
}

export interface MoneyValue {
  value: number;
  currency: Currency;
}

export interface QuoteBy {
  id: string;
  name: string;
}

export interface RemittanceProvider {
  id: string;
  name: string;
}

export interface TransferMethod {
  id: string;
  name: string;
}
