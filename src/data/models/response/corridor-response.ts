export interface Country {
  name: string;
  iso2Code: string;
  iso3Code: string;
}

export interface CurrencyConfiguration {
  rspName: string;
  decimalPlaces: number;
  roundDirection: string;
}

export interface Currency {
  name: string;
  iso3Code: string;
  symbol: string;
  decimalPlaces: number;
  currencyConfigurations?: CurrencyConfiguration[];
}

export interface Corridor {
  id?: string;
  name?: string;
  destinationCountry: Country;
  sourceCurrency: Currency[];
  destinationCurrency: Currency[];
  transferMethod: string;
}

// A API retorna um array de Corridor diretamente
export type CorridorResponse = Corridor[];
