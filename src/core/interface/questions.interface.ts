import { Document } from "mongoose";

export interface ICodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

export interface ITopicTag {
  name?: string;
}
export interface ITestCase {
  input: string;
  output: string;
}
export interface IQuestion extends Document {
  frontendQuestionId?: string;
  acRate?: number;
  codeSnippets?: ICodeSnippet[];
  content?: string;
  difficulty?: string;
  exampleTestcaseList?: string[];
  metaData?: string;
  title?: string;
  titleSlug?: string;
  topicTags?: ITopicTag[];
  categoryTitle?: string;
  testCases: ITestCase[];
  sampleTestCases: ITestCase[];
}

export interface QuestoinFilterInterface {
  categoryTitle?: string;
  difficulty?: string;
  title?: object;
  topicTags?: { $in: string[] } | { $elemMatch: { name: { $in: string[] } } }; // Adjusted to allow both $in and $elemMatch
}

export interface PaginationInterface {
  skip?: number;
  limit?: number;
}
export interface QuestionOutputInterface {
  title: string;
  topicTags: ITopicTag;
  categoryTitle: string;
  content: string;
  acRate: number;
  difficulty: string;
}
