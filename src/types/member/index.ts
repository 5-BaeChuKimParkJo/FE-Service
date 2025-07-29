export interface MemberInfo {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: string;
  state: string;
  profileImageUrl: string;
  point: number;
}

export interface MemberSummary {
  memberUuid: string;
  nickname: string;
  profileImageUrl: string;
}
