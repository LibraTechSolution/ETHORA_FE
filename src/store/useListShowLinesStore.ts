import { ITradingData } from '@/types/trade.type';
import { create } from 'zustand';

interface ListLinesState {
  listLines: ITradingData[];
  updateListLine(listLines: ITradingData[]): void;
  setListLines(line: ITradingData, isUpdated?: boolean): void;
  resetListLine(): void;
}

const useListShowLinesStore = create<ListLinesState>()(
  (set) => ({
    listLines: [],
    setListLines: (line, isUpdated) => set((state) => {
      let indexOf: number | null = null
      const tempList = [...state.listLines]
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i]._id === line._id) {
          indexOf = i
          break;
        }
      }

      if (indexOf === null) {
        tempList.push(line)
      } else {
        if (isUpdated) {
          tempList[indexOf] = line
        } else {
          tempList.splice(indexOf, 1)
        }
      }

      return ({ listLines: [...tempList] })
    }),
    updateListLine: (listLines) => set(() => ({ listLines })),
    resetListLine: () => set(() => ({ listLines: [] }))
  })
);

export default useListShowLinesStore;
