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
    bufferBOSC: '0xbf41098cd4a6a405e6e33647b983d1a63334bc1b',
    optionConfigSC: '0xc603D6D088940D88538fEC72F156c863ea3b0E95',
    marketOIConfigSC: '0x60A406DB2782bb99bE1E85d9F83a516A5b99e32e',
    settlementFee: 1250
  },
  ETHUSD: {
    bufferBOSC: '0xeBACAfBcb0aC27b67319827F6b09cC84B9017BAA',
    optionConfigSC: '0x5be17c1570fE08f121f62A030c905e2E106FbbDf',
    marketOIConfigSC: '0x3dDD30025D75567e5C5E373532721C8ac764Ea81',
    settlementFee: 500
  },
  LINKUSD: {
    bufferBOSC: '0xD25B64CE363c03054591CaD3d69b86E571e1aCf6',
    optionConfigSC: '0x69441a5f4563A3265be90564739DFe32F15E27f5',
    marketOIConfigSC: '0xFC5c9616114360278Ca341bebF8d61A1D9Bb8c6d',
    settlementFee: 1500
  },
  TONUSD: {
    bufferBOSC: '0x65CEb3Cd7241894D189F686a5603CE2eD08ce9b0',
    optionConfigSC: '0x62dd4298Ea0F94a41a64d17d3ea53F49986836cF',
    marketOIConfigSC: '0xAd01F58650FC208FbaAAB224Aa23518B61583b31',
    settlementFee: 1750
  },
  ARBUSD: {
    bufferBOSC: '0xaf88116F29EB365cE6519A5612F7C9a85a950210',
    optionConfigSC: '0x99d3fa1db843a27b77Dfd8F98997b39B3f780718',
    marketOIConfigSC: '0xC946Aef7592253BACe9EB44C98B65Ba227127EbB',
    settlementFee: 1500
  },
  XRPUSD: {
    bufferBOSC: '0x69287935bea51cF4e6a50FCf51997343DDB6760F',
    optionConfigSC: '0xE18CC6CACBa07E50DaA5D95EB8938F613C40BD27',
    marketOIConfigSC: '0x0FD7fFEC34aAAD52619114B7a3fDf74d410e1Faa',
    settlementFee: 1500
  },
  SOLUSD: {
    bufferBOSC: '0xf3d2691552a48E0FB1B601e1d9c4B68a17c228f7',
    optionConfigSC: '0xDC671d87A6d47174Bdabd614278976bBc261FaB1',
    marketOIConfigSC: '0x4e9a34A8c3BA169EA5aB40FC52B4A43a069952b0',
    settlementFee: 1750
  },
  BNBUSD: {
    bufferBOSC: '0x0D2c4a4849B9445dF604d9e24D01C906DAAF360f',
    optionConfigSC: '0xa63D1fCec86289f47F1fc94E588C18A033CA3c89',
    marketOIConfigSC: '0x68a55C9b93C489A7Df0ea84dC829Ee6479aa0D61',
    settlementFee: 1500
  },
  BOGEUSD: {
    bufferBOSC: '0x9bf3Bb28619ACC2140fe06564b8ceF2283dAc08E',
    optionConfigSC: '0x06060976b6376649c06BA47ed515e71547379f06',
    marketOIConfigSC: '0x2f4832a7e6C24Ddde3d97e2d4C400A5230CB06E1',
    settlementFee: 2250
  },
  EURUSD: {
    bufferBOSC: '0x25Ed2e9eC55522c19dcF46921dFF4706c3e4Ca82',
    optionConfigSC: '0x0057225944D68A24a8A7aa1c95eA12c1BdE8fE81',
    marketOIConfigSC: '0x01fD66D2346D70EEC93171Ef0fEBE1AF84E5F1d8',
    settlementFee: 1250
  },
  XAUUSD: {
    bufferBOSC: '0x41167b680f71451c7592ca1e6dDBD4406eeaAE08',
    optionConfigSC: '0x00E31233aC0f4444815784D89d3920d69f012D60',
    marketOIConfigSC: '0x882d9CB54A02746242A593F3e392f508C840e12e',
    settlementFee: 1250
  },
  GBPUSD: {
    bufferBOSC: '0x19FEfFFFC93bA557331136fBbeC38B1c2a08557C',
    optionConfigSC: '0xd6A9FCE320e2E63Bee119f8fE8546aCeF195403f',
    marketOIConfigSC: '0x592D051c5f723b1d247C58DF48f63cC519BE1E3b',
    settlementFee: 1250
  },
  XAGUSD: {
    bufferBOSC: '0x0DF7811A8F1878f844Dc4485cFfAd9Dff1F8e10b',
    optionConfigSC: '0x8f380Fb811E1e65ABD95A25c9Ed4F1594dD352a2',
    marketOIConfigSC: '0x7350aEac48789a472325c44ae6803dA202326A0a',
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