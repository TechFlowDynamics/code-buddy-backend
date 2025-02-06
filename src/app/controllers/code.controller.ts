import { Request, Response } from 'express';
import { executeCode } from '../service/code.service';
import { saveSubmission } from '../service/submission.service';
import questionsModel from '../../data/models/questions.model';


interface AuthRequest extends Request {
    user: { id: string }
  }
  export const runCode = async (req: Request, res: Response) => {
    try {
      const { code, language, questionId: title } = req.body;
      
      const question = await questionsModel.findOne({ title });
      if (!question) {
        return res.status(404).json({
          error: 'Question not found',
          details: `No question found with title: ${title}`
        });
      }
  
      const result = await executeCode({
        code,
        language,
        question,  // Pass the entire question object
        isSubmission: false
      });
  
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Code execution failed',
        details: error.message 
      });
    }
  };
  export const submitCode = async (req: Request, res: Response) => {
    try {
      const { code, language, questionId: title, roomId } = req.body;
      const userId = (req as AuthRequest).user.id;
  
      // Find question by title
      const question = await questionsModel.findOne({ title });
      if (!question) {
        return res.status(404).json({
          error: 'Question not found',
          details: `No question found with title: ${title}`
        });
      }
  
      const result = await executeCode({
        code,
        language,
        question,  // Pass the entire question object
        isSubmission: true
      });
  
      // Save submission to database
      const submission = await saveSubmission({
        code,
        language,
        questionId: title,
        roomId,
        userId,
        result
      });
  
      res.json({
        ...result,
        submissionId: submission.id
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Submission failed',
        details: error.message 
      });
    }
  };