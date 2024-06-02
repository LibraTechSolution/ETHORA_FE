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
    bufferBOSC: '0xFbD781cc27c2373b4d69C42Ff401bDAd305044D3',
    optionConfigSC: '0x4a745d3927EDE05FE1a86F8D47f867B81F933e57',
    marketOIConfigSC: '0x83665D27bc54F7322D3df9Aab9ca5d6C3C944cD8',
    settlementFee: 1250
  },
  ETHUSD: {
    bufferBOSC: '0xDFAa87bD74e15E617362335a72076e340f9d3FE3',
    optionConfigSC: '0xD879571Ac192425c9e868E5255307C6292CdB863',
    marketOIConfigSC: '0x6263c51B5642C81282c64a7228a60997B5410839',
    settlementFee: 500
  },
  LINKUSD: {
    bufferBOSC: '0x14B0A7C29f7C6bDC6f0A5b8d6dE85314986e5701',
    optionConfigSC: '0x0Ce2A986E1c2C5A7d751BaDED0ABF7435e26A98c',
    marketOIConfigSC: '0x0619b58D8B08595a25043BC97B648b39CcBa162a',
    settlementFee: 1500
  },
  TONUSD: {
    bufferBOSC: '0x59d11707380510370095f3FBE99ae7dd6634ce41',
    optionConfigSC: '0xbDf60471008184De46d41F7d8a7c2f757b5495c2',
    marketOIConfigSC: '0xB8F180791B0bb0886328eE6D2C312b7575eAcb05',
    settlementFee: 1750
  },
  ARBUSD: {
    bufferBOSC: '0x34890BeBFaAa22FB248d0E4F1819D45962CfEF26',
    optionConfigSC: '0x55a5b7f61c5143C17CAdF65495840A85EC0524b7',
    marketOIConfigSC: '0x0Dabfc1A095a56F5e691BB4610aa2268fD1Ea3Ee',
    settlementFee: 1500
  },
  XRPUSD: {
    bufferBOSC: '0xf71771aC08BF7e21A421dCa9dB9bBD19D964a53c',
    optionConfigSC: '0xBAfbEd764E55C6e05693652185680cCe23BD1234',
    marketOIConfigSC: '0x5F4D146FC4C90E6cB78097b04CC61F97FC870ED8',
    settlementFee: 1500
  },
  SOLUSD: {
    bufferBOSC: '0x2E9412442689247a0c1A6D7FB3da7747017e169a',
    optionConfigSC: '0x205Ad9e4c2F683CFA46b3B2e69e7851D3b3DddC4',
    marketOIConfigSC: '0x45082FE6dd5F64BA5ec4DB8cD3E3d7F773F0B198',
    settlementFee: 1750
  },
  BNBUSD: {
    bufferBOSC: '0x305dA603B056b32532D2CCCb8c1c0599459f1340',
    optionConfigSC: '0x15380610E0b8F314E58887a06f5ea1F02B0Ebc8B',
    marketOIConfigSC: '0xE28177a7f4E749B7375F6C9a98A3A0db0E8Eeb75',
    settlementFee: 1500
  },
  BOGEUSD: {
    bufferBOSC: '0x9bf3Bb28619ACC2140fe06564b8ceF2283dAc08E',
    optionConfigSC: '0x06060976b6376649c06BA47ed515e71547379f06',
    marketOIConfigSC: '0x2f4832a7e6C24Ddde3d97e2d4C400A5230CB06E1',
    settlementFee: 2250
  },
  EURUSD: {
    bufferBOSC: '0x3f4e6764ECf7F985Cf03C70877F2c251a497474C',
    optionConfigSC: '0xBb5d868b294541538b622D5744ff69F6368a0456',
    marketOIConfigSC: '0x8F804E6a6d3050C223A27c4Be63F3b81eb1293d5',
    settlementFee: 1250
  },
  XAUUSD: {
    bufferBOSC: '0xe98Ea79623F8C5D9B609ff3ffFD5377DC51Cb820',
    optionConfigSC: '0x7a902032799d5Aec183cf04C6B912588632aeDf1',
    marketOIConfigSC: '0x195a0402DCBcDfE7b3331550d9C5dEF9bA079Fa3',
    settlementFee: 1250
  },
  GBPUSD: {
    bufferBOSC: '0x3F3c63dF6E0571d7bBd8e628A9988C3d3d8234d3',
    optionConfigSC: '0x1c141446C2972F6DAb6Fe4f2B062844C54A9Bc4d',
    marketOIConfigSC: '0xb9C7960b4e71B0Af799c20Ff1dE52af7D918D893',
    settlementFee: 1250
  },
  XAGUSD: {
    bufferBOSC: '0x775453B91F97bda33943868f7bB4e191b6cB047D',
    optionConfigSC: '0xF55bAbbed0D945305fc0Af1D0331da3B8C1E0e63',
    marketOIConfigSC: '0x81bea81eF249C815366aE21d994c2B93122Fd19f',
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