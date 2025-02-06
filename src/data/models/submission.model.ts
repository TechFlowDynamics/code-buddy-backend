import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  code: String,
  language: String,
  questionId: mongoose.Schema.Types.ObjectId,
  roomId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  status: String,
  executionTime: Number,
  memoryUsed: Number,
  testCases: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    executionTime: Number,
    memoryUsed: Number
  }],
  submittedAt: Date
});

export const Submission = mongoose.model('Submission', submissionSchema);