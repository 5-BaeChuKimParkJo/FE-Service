import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AuctionSettingsState = {
  minimumBid: string;
  startAt: Date | null;
  duration: number; // 시간 단위 (1-168시간)
  endAt: Date | null;
  isDirectDeal: boolean;
  directDealLocation: string;
  errors: Record<string, string>;
};

export type AuctionSettingsActions = {
  // Setters
  setMinimumBid: (bid: string) => void;
  setStartAt: (date: Date | null) => void;
  setDuration: (hours: number) => void;
  setEndAt: (date: Date | null) => void;
  setIsDirectDeal: (isDirect: boolean) => void;
  setDirectDealLocation: (location: string) => void;

  // Error handling
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;

  // Validation
  validate: () => boolean;
  isValid: () => boolean;

  // Reset
  reset: () => void;
};

const initialState: AuctionSettingsState = {
  minimumBid: '',
  startAt: null,
  duration: 24, // 기본 24시간
  endAt: null,
  isDirectDeal: false,
  directDealLocation: '',
  errors: {},
};

export const useAuctionSettingsStore = create<
  AuctionSettingsState & AuctionSettingsActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setMinimumBid: (bid) => {
        set({ minimumBid: bid });
        get().clearError('minimumBid');
      },

      setStartAt: (date) => {
        set({ startAt: date });
        if (date) {
          const { duration } = get();
          const endAt = new Date(date.getTime() + duration * 60 * 60 * 1000);
          set({ endAt });
        }
        get().clearError('startAt');
      },

      setDuration: (hours) => {
        set({ duration: hours });
        const { startAt } = get();
        if (startAt) {
          const endAt = new Date(startAt.getTime() + hours * 60 * 60 * 1000);
          set({ endAt });
        }
        get().clearError('duration');
      },

      setEndAt: (date) => set({ endAt: date }),

      setIsDirectDeal: (isDirect) => {
        set({ isDirectDeal: isDirect });
        if (!isDirect) {
          set({ directDealLocation: '' });
        }
      },

      setDirectDealLocation: (location) => {
        set({ directDealLocation: location });
        get().clearError('directDealLocation');
      },

      setError: (field, error) => {
        const { errors } = get();
        set({ errors: { ...errors, [field]: error } });
      },

      clearError: (field) => {
        const { errors } = get();
        const newErrors = { ...errors };
        delete newErrors[field];
        set({ errors: newErrors });
      },

      clearErrors: () => set({ errors: {} }),

      isValid: () => {
        const state = get();
        const isMinimumBidValid =
          state.minimumBid && parseFloat(state.minimumBid) >= 1000;
        const isStartAtValid = state.startAt && state.startAt > new Date();
        const isDirectDealValid =
          !state.isDirectDeal || state.directDealLocation.trim().length > 0;

        return isMinimumBidValid && isStartAtValid && isDirectDealValid;
      },

      validate: () => {
        const state = get();
        state.clearErrors();

        if (!state.minimumBid || parseFloat(state.minimumBid) <= 0) {
          state.setError('minimumBid', '최소 입찰가를 입력해주세요.');
          return false;
        }
        if (parseFloat(state.minimumBid) < 1000) {
          state.setError(
            'minimumBid',
            '최소 입찰가는 1000원 이상이어야 합니다.',
          );
          return false;
        }
        if (!state.startAt) {
          state.setError('startAt', '경매 시작 시간을 선택해주세요.');
          return false;
        }
        if (state.startAt <= new Date()) {
          state.setError(
            'startAt',
            '경매 시작 시간은 현재 시간 이후여야 합니다.',
          );
          return false;
        }
        if (state.isDirectDeal && !state.directDealLocation.trim()) {
          state.setError('directDealLocation', '직거래 위치를 입력해주세요.');
          return false;
        }
        return true;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'auction-settings-store',
    },
  ),
);
