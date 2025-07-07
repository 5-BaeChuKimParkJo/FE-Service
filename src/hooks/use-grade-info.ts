import { useQuery } from '@tanstack/react-query';
import { Grade } from '@/types/grade';
import { getGradeInfo } from '@/actions/grade-service';

export function useGradeInfo(gradeUuid: string) {
  return useQuery<Grade>({
    queryKey: ['grade', gradeUuid],
    queryFn: () => getGradeInfo(gradeUuid),
    staleTime: Infinity, // 평생 캐싱
    gcTime: Infinity, // 가비지 컬렉션도 무한으로 설정
    retry: 3,
    retryDelay: 1000,
  });
}
