import { getMemberSummary } from '@/actions/member-service';
import { getProductDetail } from '@/actions/product-service/get-product-detail';
import { getAuctionDetail } from '@/actions/auction-service';
import { ChatroomInfoResponse } from '@/types/chat';
import { MemberSummary } from '@/types/member';
import { ProductDetailResponse } from '@/types/product';
import { CatalogAuctionResponseDto } from '@/types/auction/auction-read';

export interface ChatRoomHeaderData {
  href: string;
  product: ProductDetailResponse | CatalogAuctionResponseDto;
  price: number;
  imageUrl: string;
  status: string;
  sellerInfo: MemberSummary;
}

export async function getChatRoomHeaderData(
  chatroomInfo: ChatroomInfoResponse,
): Promise<ChatRoomHeaderData> {
  const sellerUuid = chatroomInfo.members.find(
    (member) => member.role === 'SELLER',
  )?.memberUuid as string;
  const sellerInfo = await getMemberSummary(sellerUuid);

  let href = '';
  let product;
  let price = 0;
  let imageUrl = '';
  let status = '';

  if (chatroomInfo.chatRoomType === 'NORMAL_PRIVATE') {
    href = `/products/${chatroomInfo.postUuid}`;
    product = await getProductDetail(chatroomInfo.postUuid);
    price = product.price;
    imageUrl = product.imageUrlList[0].url;
    switch (product.status) {
      case 'ACTIVE':
        status = '판매중';
        break;
      case 'ENDED':
        status = '판매완료';
        break;
      case 'DEALING':
        status = '거래중';
        break;
    }
  } else {
    href = `/auctions/${chatroomInfo.postUuid}`;
    product = await getAuctionDetail(chatroomInfo.postUuid);
    price = product.currentBid;
    imageUrl = product.images[0].url;
    status = '경매 종료';
  }

  return {
    href,
    product,
    price,
    imageUrl,
    status,
    sellerInfo,
  };
}
