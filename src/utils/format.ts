export function moneyFormatted(num: number, decimalPlaces: number): number {
  if (isNaN(num)) return 0;
  return num / Math.pow(10, decimalPlaces);
}
