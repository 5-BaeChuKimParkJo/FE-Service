export type PresignedUrlRequest = {
  fileName: string;
  contentType: string;
};

export type PresignedUrlResponse = {
  uploadUrl: string;
  fields: Record<string, string>;
  key: string;
};
