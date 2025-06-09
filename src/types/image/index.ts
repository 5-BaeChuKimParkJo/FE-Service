export type PresignedUrlRequest = {
  fileName: string;
  contentType: string;
};

export type PresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};
