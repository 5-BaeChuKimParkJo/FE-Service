'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getMemberProfileUrl } from '@/actions/member-service/get-member-profile-url';
import { uploadFileToS3 } from '@/actions/image-service/upload-to-s3';
import { updateMemberInfo } from '@/actions/member-service/update-member-info';
import type { MemberInfo } from '@/types/member';
import { ErrorResponse } from '@/types/api';
import { Dialog } from '@/components/ui/dialog';
import { validateNickname } from '@/libs/validation.utils';

interface EditProfileFormProps {
  myInfo: MemberInfo;
}

export default function EditProfileForm({ myInfo }: EditProfileFormProps) {
  const [nickname, setNickname] = useState(myInfo.nickname || '');
  const [nicknameError, setNicknameError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(
    myInfo.profileImageUrl || null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    let profileImageKey: string | undefined = undefined;
    try {
      if (file) {
        const presigned = await getMemberProfileUrl({ contentType: file.type });
        if (!presigned) throw new Error('presigned-url 응답이 없습니다');
        const uploadUrl = presigned.url;
        const fields = presigned.fields;
        const key = presigned.fields.key;
        if (!uploadUrl || !fields || !key)
          throw new Error('presigned-url 응답이 올바르지 않습니다');
        await uploadFileToS3(file, uploadUrl, fields);
        profileImageKey = key;
      }
      const updatePayload: { nickname?: string; profileImageKey?: string } = {};
      if (nickname !== myInfo.nickname) updatePayload.nickname = nickname;
      if (profileImageKey) updatePayload.profileImageKey = profileImageKey;
      await updateMemberInfo(updatePayload);
      setSuccess(true);
    } catch (err) {
      const serverMessage = (err as ErrorResponse)?.message || '업데이트 실패';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const isChanged = (nickname !== myInfo.nickname && !nicknameError) || !!file;

  return (
    <>
      <div className='max-w-md mx-auto py-10 px-4'>
        <h2 className='text-2xl font-bold mb-6 text-center text-primary-100'>
          닉네임 & 프로필 이미지 수정
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center'>
              {profileImage ? (
                <Image
                  width={96}
                  height={96}
                  src={profileImage}
                  alt='프로필 미리보기'
                  className='object-cover w-full h-full'
                />
              ) : (
                <span className='text-gray-400'>이미지 없음</span>
              )}
            </div>
            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
            >
              프로필 이미지 변경
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
            />
          </div>
          <div>
            <Input
              label='닉네임'
              type='text'
              value={nickname}
              onChange={handleNicknameChange}
              maxLength={20}
              error={nicknameError}
            />
          </div>
          {error && <div className='text-red-500 text-sm'>{error}</div>}
          <Button
            type='submit'
            size='xl'
            variant='primary'
            className='w-full'
            disabled={loading || !isChanged || !!nicknameError}
          >
            {loading ? '저장 중...' : '저장하기'}
          </Button>
        </form>
      </div>
      <Dialog isOpen={success} onClose={() => setSuccess(false)}>
        <div className='p-6 text-center'>
          <div className='text-xl font-bold mb-4 text-primary-100'>
            수정 완료!
          </div>
          <Button onClick={() => setSuccess(false)} className='w-full mt-2'>
            닫기
          </Button>
        </div>
      </Dialog>
    </>
  );
}
