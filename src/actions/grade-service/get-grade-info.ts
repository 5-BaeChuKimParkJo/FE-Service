'use server';

import { instance } from '@/actions/instance';
import { Grade } from '@/types/grade';

export async function getGradeInfo(gradeUuid: string): Promise<Grade> {
  const response = await instance.get<Grade>(
    `/grade-service/api/v1/${gradeUuid}`,
    {
      next: {
        revalidate: Infinity,
      },
      cache: 'force-cache',
    },
  );
  return response;
}
