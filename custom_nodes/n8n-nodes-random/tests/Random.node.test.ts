import { Random } from '../nodes/Random/Random.node';
import { IExecuteFunctions } from 'n8n-workflow';

const createMockExecuteFunctions = (params: any = {}): IExecuteFunctions => {
  const mockHelpers = {
    request: jest.fn(),
  };

  return {
    getInputData: jest.fn().mockReturnValue([{ json: {} }]),
    getNodeParameter: jest.fn((paramName: string) => params[paramName]),
    getNode: jest.fn().mockReturnValue({ name: 'Random' }),
    continueOnFail: jest.fn().mockReturnValue(false),
    helpers: mockHelpers,
  } as any;
};

describe('Random Node', () => {
  let randomNode: Random;

  beforeEach(() => {
    randomNode = new Random();
  });

  describe('Node Description', () => {
    test('should have correct node properties', () => {
      expect(randomNode.description.displayName).toBe('Random');
      expect(randomNode.description.name).toBe('random');
      expect(randomNode.description.description).toBe('Generates random numbers using Random.org');
    });

    test('should have correct operation defined', () => {
      const operations = randomNode.description.properties.find(prop => prop.name === 'operation');
      expect(operations).toBeDefined();
      expect(operations?.type).toBe('options');
      if (operations && 'options' in operations && operations.options) {
        expect(operations.options).toHaveLength(1);
        expect(operations.options[0]).toHaveProperty('value', 'generateRandomNumber');
      }
    });
  });

  describe('Execute Function', () => {
    test('should generate random number successfully', async () => {
      const mockExecuteFunctions = createMockExecuteFunctions({
        operation: 'generateRandomNumber',
        min: 1,
        max: 10,
      });

      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue('5\n');

      const result = await randomNode.execute.call(mockExecuteFunctions);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json).toMatchObject({
        randomNumber: 5,
        min: 1,
        max: 10,
        source: 'Random.org',
      });
      expect(result[0][0].json.timestamp).toBeDefined();
    });

    test('should throw error when min > max', async () => {
      const mockExecuteFunctions = createMockExecuteFunctions({
        operation: 'generateRandomNumber',
        min: 10,
        max: 1,
      });

      await expect(randomNode.execute.call(mockExecuteFunctions))
        .rejects
        .toThrow('Minimum number cannot be greater than maximum number');
    });

    test('should handle API request failure', async () => {
      const mockExecuteFunctions = createMockExecuteFunctions({
        operation: 'generateRandomNumber',
        min: 1,
        max: 10,
      });

      (mockExecuteFunctions.helpers.request as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(randomNode.execute.call(mockExecuteFunctions))
        .rejects
        .toThrow('Network error');
    });

    test('should handle invalid API response', async () => {
      const mockExecuteFunctions = createMockExecuteFunctions({
        operation: 'generateRandomNumber',
        min: 1,
        max: 10,
      });

      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue('invalid_response');

      await expect(randomNode.execute.call(mockExecuteFunctions))
        .rejects
        .toThrow('Error processing response from Random.org API');
    });

    test('should make correct API call to Random.org', async () => {
      const mockExecuteFunctions = createMockExecuteFunctions({
        operation: 'generateRandomNumber',
        min: 5,
        max: 15,
      });

      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue('10\n');

      await randomNode.execute.call(mockExecuteFunctions);

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://www.random.org/integers/?num=1&min=5&max=15&col=1&base=10&format=plain&rnd=new',
        timeout: 10000,
      });
    });
  });
});