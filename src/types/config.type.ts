export interface IConfigPair {
  "IV": string,
  "IVFactorOTM": string,
  "IVFactorITM": string
}

export interface IConfigListPair {
  [key: string]: IConfigPair
}