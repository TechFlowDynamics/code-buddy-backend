import mongoose from 'mongoose';
import questionsModel from '../data/models/questions.model';
import config from "../config";
const dbConnectionUrl = `${config.MONGODB_CONNECTION_URL}/${config.DB_NAME}`;
const updateTestCases = async () => {
  try {
    await mongoose.connect(dbConnectionUrl);

    const testCases = [
      {
        input: '[2,7,11,15]\n9',
        output: '[0,1]'
      },
      {
        input: '[3,2,4]\n6',
        output: '[1,2]'
      },
      {
        input: '[3,3]\n6',
        output: '[0,1]'
      }
    ];

    await questionsModel.findOneAndUpdate(
      { title: 'Two Sum' },
      { 
        $set: { 
          testCases,
          sampleTestCases: [testCases[0]]
        }
      }
    );

    console.log('Test cases updated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

updateTestCases();