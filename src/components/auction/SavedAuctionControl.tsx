import { getSavedAuctionState } from '@/actions/auction-service/saved-auctions';
import { SavedAuctionButton } from './SavedAuctionButton';

export async function SavedAuctionControl({
  auctionUuid,
}: {
  auctionUuid: string;
}) {
  const initial = await getSavedAuctionState(auctionUuid);
  return (
    <SavedAuctionButton
      key={
        auctionUuid +
        ':' +
        (initial.ok ? String(initial.saved) : initial.error.code)
      }
      auctionUuid={auctionUuid}
      initial={initial}
    />
  );
}
