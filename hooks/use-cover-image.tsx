import { create } from "zustand";

type coverImage = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))