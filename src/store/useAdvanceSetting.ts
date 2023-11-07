import { create } from 'zustand';
import { persist } from "zustand/middleware";
import { StorageStoreName } from "./constants";

interface ISetting {
  isPartialFill: boolean,
  slippage: string,
  limitOrderExpiryTime: number,
  limitOrderExpiryTimeType: string,
  isShowTradeSize: boolean,
  isShowSharePopup: boolean,
  isShowFavoriteAsset: boolean,

}

const defaultSetting: ISetting = {
  isPartialFill: true,
  slippage: '0.05',
  limitOrderExpiryTime: 5,
  limitOrderExpiryTimeType: 'h',
  isShowTradeSize: true,
  isShowSharePopup: true,
  isShowFavoriteAsset: true,
}

interface AdvanceSettingState {
  advanceSetting: Record<`0x${string}`, ISetting> | null,
  setListAdvanceSetting(address: `0x${string}`, advanceSetting?: ISetting): void;
}


const useAdvanceSetting = create<AdvanceSettingState>()(
  persist(
    (set) => ({
      advanceSetting: null,
      setListAdvanceSetting: (address, advanceSetting?) => set((state) => ({
        advanceSetting: {
          ...state.advanceSetting,
          [address]: advanceSetting ? advanceSetting : defaultSetting
        }
      })),
    }),
    {
      name: StorageStoreName.ADVANCE_SETTING,
    },
  ),
);

export default useAdvanceSetting;

