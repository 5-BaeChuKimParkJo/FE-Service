'use server';

import { instance } from '../instance';

export interface RegisterUserData {
  phoneNumber: string;
  nickname: string;
  userId: string;
  password: string;
  interests?: string[];
}

export interface RegisterResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export async function registerUser(userData: RegisterUserData) {
  // 실제 API 호출 구현
  await instance.post<RegisterResponse>('/auth/sign-up', {
    memberId: userData.userId,
    password: userData.password,
    nickname: userData.nickname,
    phoneNumber: userData.phoneNumber,
  });

  // if (!userData) {
  //   //나중에 지울 예정
  //   console.log('');
  // }
  // // 임시 구현 (API 연동 전)
  // await new Promise((resolve) => setTimeout(resolve, 1500));
  // return {
  //   success: true,
  //   userId: 'user_' + Math.random().toString(36).substr(2, 9),
  // };
}
