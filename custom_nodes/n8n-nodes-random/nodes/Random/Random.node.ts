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
        description: 'Gera números aleatórios usando Random.org',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operação',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Gerador de Números Aleatórios',
                        value: 'generateRandomNumber',
                        description: 'Gera um número aleatório entre Min e Max usando Random.org',
                        action: 'Gerar número aleatório',
                    },
                ],
                default: 'generateRandomNumber',
            },
            {
                displayName: 'Número Mínimo',
                name: 'min',
                type: 'number',
                default: 1,
                required: true,
                description: 'Valor mínimo do número aleatório (inclusivo)',
                displayOptions: {
                    show: {
                        operation: ['generateRandomNumber'],
                    },
                },
            },
            {
                displayName: 'Número Máximo',
                name: 'max',
                type: 'number',
                default: 100,
                required: true,
                description: 'Valor máximo do número aleatório (inclusivo)',
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

                    // Validação dos inputs
                    if (min > max) {
                        throw new NodeOperationError(
                            this.getNode(),
                            'O número mínimo não pode ser maior que o máximo',
                            { itemIndex: i }
                        );
                    }

                    // Construir URL da API Random.org
                    const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

                    // Fazer requisição para Random.org
                    const response = await this.helpers.request({
                        method: 'GET',
                        url,
                        timeout: 10000,
                    });

                    // Converter resposta para número
                    const randomNumber = parseInt(response.trim(), 10);

                    if (isNaN(randomNumber)) {
                        throw new NodeOperationError(
                            this.getNode(),
                            'Erro ao processar resposta da API Random.org',
                            { itemIndex: i }
                        );
                    }

                    // Preparar dados de retorno
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