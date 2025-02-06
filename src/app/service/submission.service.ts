// import { Submission } from '../models/submission.model';

import { Submission } from "../../data/models/submission.model";


interface SaveSubmissionParams {
  code: string;
  language: string;
  questionId: string;
  roomId: string;
  userId: string;
  result: any;
}

export const saveSubmission = async ({
  code,
  language,
  questionId,
  roomId,
  userId,
  result
}: SaveSubmissionParams) => {
  const submission = new Submission({
    code,
    language,
    questionId,
    roomId,
    userId,
    status: result.status,
    executionTime: result.executionTime,
    memoryUsed: result.memoryUsed,
    testCases: result.testCases,
    submittedAt: new Date()
  });

  await submission.save();
  return submission;
};