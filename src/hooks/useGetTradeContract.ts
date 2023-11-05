import { useParams } from "next/navigation";
import { useMemo } from "react";

const configPair: {
  [key: string]: {
    bufferBOSC: string,
    optionConfigSC: string,
    marketOIConfigSC: string,
    settlementFee: number
  }
} = {
  BTCUSD: {
    bufferBOSC: '0xBf41098CD4a6a405e6E33647B983d1A63334bc1B',
    optionConfigSC: '0xc603D6D088940D88538fEC72F156c863ea3b0E95',
    marketOIConfigSC: '0x60A406DB2782bb99bE1E85d9F83a516A5b99e32e',
    settlementFee: 1250
  },
  ETHUSD: {
    bufferBOSC: '0x8Edf4f76a8aE9f80CEe8a10107927ba1997C2609',
    optionConfigSC: '0xaBf936C43c33E86bc1e097eBdb71a165288f210F',
    marketOIConfigSC: '0xC5Ab6E7F2eACB1052f173D632f1f0Cf084B83076',
    settlementFee: 500
  },
  LINKUSD: {
    bufferBOSC: '0xdc45CbC2E65306CdE17cC4e7af2fe23611eb7E4E',
    optionConfigSC: '0xA7b9E7D677749410aC85A6D0207779C188882c77',
    marketOIConfigSC: '0xC7b275D05BEbE096Ff303A65F3C6Ee73fe2fFDcf',
    settlementFee: 1500
  },
  TONUSD: {
    bufferBOSC: '0x25ffe1A6BB755C9A4bDA91aC2B0aDb98A85F85d2',
    optionConfigSC: '0x9B689852C790812D303e80b489009f8e5AbBd01b',
    marketOIConfigSC: '0xC176e511EC9a9eCe7D2aa885F7b7f5B19D209939',
    settlementFee: 1750
  },
  ARBUSD: {
    bufferBOSC: '0xd6CDD8E8B2B8E3947912275c55284B88a30f839F',
    optionConfigSC: '0x26481f40440d20b5f0722C9383A0830BaBC6119c',
    marketOIConfigSC: '0x56aaCE33aC52770C9633C43CfF35DaeD092f0F00',
    settlementFee: 1500
  },
  XRPUSD: {
    bufferBOSC: '0x1A01E687278fBd5c3d86134062c1c241b9a199EC',
    optionConfigSC: '0x83a8Fb494cF7C294863aC21f16fC0F7F2bdBF5B6',
    marketOIConfigSC: '0xf28b4228752D233a38c6145Df8ad474c0F6bAaBF',
    settlementFee: 1500
  },
  SOLUSD: {
    bufferBOSC: '0x3365eEa63B05C38885c6B6b0e1BbD151cF92C15D',
    optionConfigSC: '0xfdc09C4ffc1bc577FB6Cc81ef2796748F0fF75A6',
    marketOIConfigSC: '0xfdc09C4ffc1bc577FB6Cc81ef2796748F0fF75A6',
    settlementFee: 1750
  },
  BNBUSD: {
    bufferBOSC: '0x1D389065da6A3d8f6e713909c8fE28c77c750cCc',
    optionConfigSC: '0x760a4e720aefCd6FEb695C7a2FBD68D03E009463',
    marketOIConfigSC: '0xb570d7f6ccB0ef52c48415087e66Ff92C46e3768',
    settlementFee: 1500
  },
  BOGEUSD: {
    bufferBOSC: '0x9bf3Bb28619ACC2140fe06564b8ceF2283dAc08E',
    optionConfigSC: '0x06060976b6376649c06BA47ed515e71547379f06',
    marketOIConfigSC: '0x2f4832a7e6C24Ddde3d97e2d4C400A5230CB06E1',
    settlementFee: 2250
  },
  EURUSD: {
    bufferBOSC: '0x17B5df926F47905650B121A3988e0Af2EE4419A1',
    optionConfigSC: '0x1B81F9D5F50C6ED142B0DaEa7A8969f01AC757e6',
    marketOIConfigSC: '0xa5dFEC405735362b440672b98e893bB3B591f5Bb',
    settlementFee: 1250
  },
  XAUUSD: {
    bufferBOSC: '0x6bBc6820023EB35A324601B16a5B42607b9F9E1E',
    optionConfigSC: '0x31cC8f3b3D5EE7FFE46a6D9fF2D812D13Bf6f8b5',
    marketOIConfigSC: '0xBF9912441B8B595C9B23e92203A7d763C3692399',
    settlementFee: 1250
  },
  GBPUSD: {
    bufferBOSC: '0xCb77E309C0F0854C13F0b3D64E2DCa94E64fBc6B',
    optionConfigSC: '0x58C4481bD87A911A4f5Ce8EB8C9E8FBa1B337417',
    marketOIConfigSC: '0x7F519Bd2eF03b3c7F8191B9a8Eb1902AFbdd32a4',
    settlementFee: 1250
  },
  XAGUSD: {
    bufferBOSC: '0x0992aDeDD90a0d0a37b298F317fE324EDA2BaD62',
    optionConfigSC: '0x663118Fb36B8431F532A061710Fe9799f4AdAa99',
    marketOIConfigSC: '0x108dD16810A96E90eaa39EF3073B1a5C7EBE14f5',
    settlementFee: 1250
  },
}

export const useGetTradeContract = (pair?: string) => {
  const params = useParams();

  const pairConfig = useMemo(() => {
    const tempPair = pair ? pair : params?.pair ? params?.pair : ''
    if (tempPair && configPair[(tempPair as string).replace('-', '').toUpperCase()]) {
      return configPair[(tempPair as string).replace('-', '').toUpperCase()]
    }
    return {
      bufferBOSC: '',
      optionConfigSC: '',
      marketOIConfigSC: '',
      settlementFee: 1
    }
  }, [params, pair])

  return pairConfig
}