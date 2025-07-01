export type PresignedUrlRequest = {
  contentType: string;
};

export type PresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};

export type ProductImage = {
  key: string;
  order: number;
};
