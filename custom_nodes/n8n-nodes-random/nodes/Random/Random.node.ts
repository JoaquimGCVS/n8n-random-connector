import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        icon: 'file:nodes/Random/random.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Generates random numbers using Random.org',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'True Random Number Generator',
                        value: 'generateRandomNumber',
                        description: 'Generate a random integer between Min and Max using Random.org',
                        action: 'Generate random number',
                    },
                ],
                default: 'generateRandomNumber',
            },
            {
                displayName: 'Minimum Number',
                name: 'min',
                type: 'number',
                default: 1,
                required: true,
                description: 'Minimum value for the random number (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['generateRandomNumber'],
                    },
                },
            },
            {
                displayName: 'Maximum Number',
                name: 'max',
                type: 'number',
                default: 100,
                required: true,
                description: 'Maximum value for the random number (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['generateRandomNumber'],
                    },
                },
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;

                if (operation === 'generateRandomNumber') {
                    const min = this.getNodeParameter('min', i) as number;
                    const max = this.getNodeParameter('max', i) as number;

                    if (min > max) {
                        throw new NodeOperationError(
                            this.getNode(),
                            'Minimum number cannot be greater than maximum number',
                            { itemIndex: i }
                        );
                    }

                    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

                    const response = await this.helpers.request({
                        method: 'GET',
                        url,
                        timeout: 10000,
                    });

                    const randomNumber = parseInt(response.trim(), 10);

                    if (isNaN(randomNumber)) {
                        throw new NodeOperationError(
                            this.getNode(),
                            'Error processing response from Random.org API',
                            { itemIndex: i }
                        );
                    }

                    const returnItem: INodeExecutionData = {
                        json: {
                            randomNumber,
                            min,
                            max,
                            source: 'Random.org',
                            timestamp: new Date().toISOString(),
                        },
                    };

                    returnData.push(returnItem);
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                        },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}