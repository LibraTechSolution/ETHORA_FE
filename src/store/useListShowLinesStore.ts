import { ITradingData } from '@/types/trade.type';
import { create } from 'zustand';

interface ListLinesState {
  listLines: ITradingData[];
  setListLines(line: ITradingData, isUpdated?: boolean): void;
}

const useListShowLinesStore = create<ListLinesState>()(
  (set) => ({
    listLines: [],
    setListLines: (line, isUpdated) => set((state) => {
      console.log(line)
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

      return { listLines: [...tempList] }
    }),
  })
);

export default useListShowLinesStore;
