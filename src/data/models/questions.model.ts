import {
  ICodeSnippet,
  IQuestion,
  ITestCase,
} from "../../core/interface/questions.interface";

import mongoose from "mongoose";


const testCaseSchema = new mongoose.Schema<ITestCase>({
  input: { type: String, required: true },
  output: { type: String, required: true }
});
const codeSnippetSchema = new mongoose.Schema<ICodeSnippet>({
  lang: {
    type: String,
    required: true,
  },
  langSlug: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const questionsSchema = new mongoose.Schema<IQuestion>(
  {
    frontendQuestionId: { type: String, required: true },
    acRate: { type: Number, required: true },
    codeSnippets: { type: [codeSnippetSchema], default: [] },
    content: { type: String, required: true },
    difficulty: { type: String, required: true },
    exampleTestcaseList: { type: [String], default: [] },
    metaData: { type: String, required: true },
    title: { type: String, required: true },
    titleSlug: { type: String, required: true },
    testCases: [{
      input: { type: String, required: true },
      output: { type: String, required: true }
    }],
    sampleTestCases: [{
      input: { type: String, required: true },
      output: { type: String, required: true }
    }],
    topicTags: {
      type: [
        {

          name: { type: String, required: true },
        },
      ],
      default: [],
    },
    categoryTitle: { type: String, required: true },
  },
  {
    versionKey: false, // Matches the __v property in the document
  },
  
);

// Creating the model
const questionsModel = mongoose.model("questions", questionsSchema);

export default questionsModel;
