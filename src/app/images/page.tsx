'use client';

import React, { useEffect, useState } from 'react';

export default function ImageUploadSamplePage() {
  const [file, setFile] = useState<File | null>(null);
  // const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    if (!file) return;

    const getPresignedUrl = async () => {
      try {
        // 1. Presigned URL 요청
        const response = await fetch(
          `http://localhost:3001/api/v1/auctions/presigned-url`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZjNjZjBmMy02MmI4LTQzNzEtYTAxNC02NDNmODIzMjNlZmQiLCJpYXQiOjE3NDgwODQ0MTZ9.tgqWbCcFhlGajZXiOSLa7tg9A3r0sYVNmGj8sx3nLJM`,
            },
            body: JSON.stringify({
              contentType: 'image/png',
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Presigned URL 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        // 2. MinIO에 파일 업로드
        const formData = new FormData();
        for (const [key, value] of Object.entries(data.fields)) {
          formData.append(key, value as string);
        }
        formData.append('file', file);

        const uploadRes = await fetch('http://localhost:9000/my-bucket', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error(`파일 업로드 실패: ${uploadRes.status}`);
        }

        const thumbnailKey = data.fields.key;

        // 3. 경매 생성 API 호출
        const createRes = await fetch(
          `http://localhost:3001/api/v1/auction/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZjNjZjBmMy02MmI4LTQzNzEtYTAxNC02NDNmODIzMjNlZmQiLCJpYXQiOjE3NDgwODQ0MTZ9.tgqWbCcFhlGajZXiOSLa7tg9A3r0sYVNmGj8sx3nLJM`,
            },
            body: JSON.stringify({
              categoryId: 0,
              directDealLocation: 'string',
              description: 'string',
              startAt: '2025-06-06T05:00:00.000Z',
              endAt: '2025-06-07T05:00:00.000Z',
              isDirectDeal: true,
              productCondition: 'unopened',
              thumbnailKey: thumbnailKey, // "string" -> thumbnailKey 변수 사용
              title: 'string',
              minimumBid: 0,
              images: [
                {
                  key: thumbnailKey,
                  order: 0,
                },
              ],
            }),
          },
        );

        if (!createRes.ok) {
          throw new Error(`경매 생성 실패: ${createRes.status}`);
        }

        const createResult = await createRes.json();
        console.log('경매 생성 성공:', createResult);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    getPresignedUrl();
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }

    // const files = e.target.files;
    // if (files == null) return;
    // if (files.length > 10) {
    //   alert(
    //     '최대 10개의 파일만 업로드 가능합니다. 우선 선택한 10개의 파일만 업로드 예정입니다.',
    //   );
    // }
    // const fileList = Array.from(files || []).slice(0, 10);
    // if (fileList.length > 0) {
    //   setFiles(fileList);
    // }
  };
  return (
    <div>
      <input
        type='file'
        onChange={handleFileChange}
        multiple
        accept='image/png, image/jpeg, image/jpg, image/webp, image/bmp'
      />
    </div>
  );
}
