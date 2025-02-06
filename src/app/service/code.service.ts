import Docker from 'dockerode';
import questionsModel from '../../data/models/questions.model';
import { IQuestion } from 'src/core/interface/questions.interface';

const docker = new Docker();


  
  interface ExecuteCodeParams {
    code: string;
    language: string;
    question: IQuestion;  // Change from string to Question interface
    isSubmission: boolean;
  }
interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}
interface ContainerConfig {
    Image: string;
    Cmd: string[];
    WorkingDir: string;
    NetworkDisabled: boolean;
    Memory: number;
    MemorySwap: number;
    CpuPeriod: number;
    CpuQuota: number;
    OpenStdin: boolean;
    StdinOnce: boolean;
  }
export const executeCode = async ({
  code,
  language,
  question,
  isSubmission
}: ExecuteCodeParams) => {
  // Get test cases from database

  const testCases = isSubmission ? 
  question.testCases : 
  question.sampleTestCases;

  const containerConfig = getContainerConfig(language, code);
  const results: TestResult[] = [];
  let totalTime = 0;
  let maxMemory = 0;

  for (const testCase of testCases) {
    const container = await docker.createContainer(containerConfig);
    
    try {
      await container.start();
      
      const execResult = await container.exec({
        Cmd: ['node', '-e', code],
        AttachStdout: true,
        AttachStderr: true
      });
      
      const output = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Time Limit Exceeded'));
        }, 2000);

        execResult.start({
          stdin: true,
          hijack: true
        }, (err: Error, stream: any) => {
          if (err) reject(err);

          let output = '';
          stream.on('data', (chunk: any) => output += chunk);
          stream.on('end', () => {
            clearTimeout(timeout);
            resolve(output);
          });

          
          stream.write(testCase.input);
          stream.end();
        });
      });

      const stats = await container.stats({ stream: false });
      
      totalTime += stats.cpu_stats.cpu_usage.total_usage;
      maxMemory = Math.max(maxMemory, stats.memory_stats.usage);

      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: output.trim(),
        passed: output.trim() === testCase.output.trim(),
        executionTime: stats.cpu_stats.cpu_usage.total_usage,
        memoryUsed: stats.memory_stats.usage
      });

    } catch (error: any) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: '',
        passed: false,
        executionTime: 0,
        memoryUsed: 0,
        error: error.message
      });
    } finally {
      await container.stop();
      await container.remove();
    }
  }

  return {
    success: results.every(r => r.passed),
    testCases: results,
    executionTime: totalTime,
    memoryUsed: maxMemory,
    status: getSubmissionStatus(results)
  };
};

function getContainerConfig(language: string, code: string) {
  const configs : { [key: string]: ContainerConfig }  = {
    javascript: {
      Image: 'node:16-alpine',
      Cmd: ['node', '-e', code],
      WorkingDir: '/app',
      NetworkDisabled: true,
      Memory: 512 * 1024 * 1024, // 512MB
      MemorySwap: -1,
      CpuPeriod: 100000,
      CpuQuota: 90000,
      OpenStdin: true,
      StdinOnce: true,
    },
    // Add configs for other languages
  };

  return configs[language] || configs.javascript;
}

function getSubmissionStatus(results: TestResult[]): string {
  if (results.every(r => r.passed)) return 'Accepted';
  if (results.some(r => r.error === 'Time Limit Exceeded')) 
    return 'Time Limit Exceeded';
  if (results.some(r => r.error)) return 'Runtime Error';
  return 'Wrong Answer';
}