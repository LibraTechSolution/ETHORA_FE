import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const useModalStore = create<ModalState>()(
  (set) => ({
    isOpen: false,
    onOpen: () => set(() => ({ isOpen: true })),
    onClose: () => set(() => ({ isOpen: false })),
  })
);

export default useModalStore;
