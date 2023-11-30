import bufferBOABI from "@/config/abi/bufferBOABI";
import optionsConfigABI from "@/config/abi/optionsConfigABI";
import usePairStore from "@/store/usePairStore";
import { PairData } from "@/types/trade.type";
import { divide } from "@/utils/operationBigNumber";
import { readContract } from "@wagmi/core";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Address } from "wagmi";

export const configPair: {
  [key: string]: {
    bufferBOSC: string,
    optionConfigSC: string,
    marketOIConfigSC: string,
    settlementFee: number
  }
} = {
  BTCUSD: {
    bufferBOSC: '0x90055e89fa3ed19a7855d86cdd39d4f688f83e48',
    optionConfigSC: '0x3f4e6764ECf7F985Cf03C70877F2c251a497474C',
    marketOIConfigSC: '0xfaBCf9295883A5131F28A2151C501F69011c09fA',
    settlementFee: 1250
  },
  ETHUSD: {
    bufferBOSC: '0x5b5cb70e334888a485bd410f1fb87aa81d3cee3e',
    optionConfigSC: '0xB0CD65eC87Cbb4313EB84f8dC22051bf88Da20FA',
    marketOIConfigSC: '0x7A9Cb0ff0503f0b03c6484170a587c0359B19368',
    settlementFee: 500
  },
  LINKUSD: {
    bufferBOSC: '0x3207aa0b75d20b790196d1998066887c8bd97d63',
    optionConfigSC: '0x222D231969a1f63b313C474607Ee1443a2299892',
    marketOIConfigSC: '0x384A604990A3D24E8fA84506B3FF9B50F0d5e770',
    settlementFee: 1500
  },
  TONUSD: {
    bufferBOSC: '0x07edec238b1cbfcce98669f0a7b61349162cc278',
    optionConfigSC: '0x8807EF530E77a69Cb63c8a820b29996e99b7116E',
    marketOIConfigSC: '0x7D3BeFf9FA2AA911cc5169f7F09aCB5993d68622',
    settlementFee: 1750
  },
  ARBUSD: {
    bufferBOSC: '0x89d2b1455b3a49dc0b19541745cc9080e3226b38',
    optionConfigSC: '0x4c2911196c6F4A119f9Ac92462b84160D761A49E',
    marketOIConfigSC: '0xDFE4a164BddD1C8B0b0c609A2324c24D89f2ED73',
    settlementFee: 1500
  },
  XRPUSD: {
    bufferBOSC: '0x7d3c0d846907136281d486a667f41579c63a1aa2',
    optionConfigSC: '0x8bB5A3EBBB36fC5Ac441e8c67bf935b545c8DfC2',
    marketOIConfigSC: '0xB39920cAAA49863Fbc69C320eB07F2096f58FCf9',
    settlementFee: 1500
  },
  SOLUSD: {
    bufferBOSC: '0x01c059dca520ce23cd5635f699c2012a6e9d9b78',
    optionConfigSC: '0xd706Aa0684305eb99f8372647c909A4E9aFFE111',
    marketOIConfigSC: '0xc87d443828F02958b09DA1cd78d0068C5dB76A40',
    settlementFee: 1750
  },
  BNBUSD: {
    bufferBOSC: '0x8edf4f76a8ae9f80cee8a10107927ba1997c2609',
    optionConfigSC: '0xaBf936C43c33E86bc1e097eBdb71a165288f210F',
    marketOIConfigSC: '0xC5Ab6E7F2eACB1052f173D632f1f0Cf084B83076',
    settlementFee: 1500
  },
  BOGEUSD: {
    bufferBOSC: '0x9bf3Bb28619ACC2140fe06564b8ceF2283dAc08E',
    optionConfigSC: '0x06060976b6376649c06BA47ed515e71547379f06',
    marketOIConfigSC: '0x2f4832a7e6C24Ddde3d97e2d4C400A5230CB06E1',
    settlementFee: 2250
  },
  EURUSD: {
    bufferBOSC: '0xdc45cbc2e65306cde17cc4e7af2fe23611eb7e4e',
    optionConfigSC: '0xA7b9E7D677749410aC85A6D0207779C188882c77',
    marketOIConfigSC: '0xC7b275D05BEbE096Ff303A65F3C6Ee73fe2fFDcf',
    settlementFee: 1250
  },
  XAUUSD: {
    bufferBOSC: '0x9b689852c790812d303e80b489009f8e5abbd01b',
    optionConfigSC: '0xC176e511EC9a9eCe7D2aa885F7b7f5B19D209939',
    marketOIConfigSC: '0x0DE3001D4ad610caB72462EB1520BB9644F41e09',
    settlementFee: 1250
  },
  GBPUSD: {
    bufferBOSC: '0x37ec5a0847331ecee6944827ea3ef7468d12c69e',
    optionConfigSC: '0x23d3ECF1F4842a59182d09Fe8D9926a38200768e',
    marketOIConfigSC: '0xBEE9874419b4ff69b88f83E2BAAAe76D1D48F5a4',
    settlementFee: 1250
  },
  XAGUSD: {
    bufferBOSC: '0x2144a883db914540a9b6c50a4eccaeaad089c1d9',
    optionConfigSC: '0xc5f4aFF2578D744f7a6E79504eE3F2c5469Ab509',
    marketOIConfigSC: '0x53D7E88903e092D131D96232601a7d933ACE406d',
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

export const useGetMinMaxTradeSize = (pair?: string) => {
  const params = useParams();
  const [maxTradeSize, setMaxTradeSize] = useState<number>(100)
  const [minTradeSize, setMinTradeSize] = useState<number>(0)

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

  const getMinMaxTradeSize = useCallback(async () => {
    const maxTradeSize = await readContract({
      address: pairConfig.bufferBOSC as Address,
      abi: bufferBOABI,
      functionName: 'getMaxTradeSize'
    });
    const minTradeSize = await readContract({
      address: pairConfig.optionConfigSC as Address,
      abi: optionsConfigABI,
      functionName: 'minFee'
    });
    setMaxTradeSize(+divide(maxTradeSize.toString() ?? '0', 6))
    setMinTradeSize(+divide(minTradeSize.toString() ?? '0', 6))
  }, [pairConfig.bufferBOSC, pairConfig.optionConfigSC])

  useEffect(() => {
    if (!pairConfig) return
    getMinMaxTradeSize()
  }, [getMinMaxTradeSize, pairConfig])

  return { maxTradeSize, minTradeSize }
}