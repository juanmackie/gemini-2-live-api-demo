--- START OF FILE defect_quote_output_task.js ---
import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';

/**
 * Represents a tool for checking the task that is output from an actioned defect quote
 */
export class defect_quote_output_taskTool { // Class name is correct and consistent with import

    /**
     * Returns the tool declaration for defect_quote_output_task checking
     * @returns {Object} An object defining the tool's function.
     */
    getDeclaration() {
        return [{
            name: "defect_quote_output_task_checker", // Function name for this tool - aligned with tool-manager.js
            description: "Finds the output task from a actioned defect quote. Supply the webhook the defect quote number eg: Q-12345 and returns task with approved scope of works",
            parameters: {
                type: "object",
                properties: {
                    defectquotenum: {
                        type: "string",
                        description: "The defect quote number to check status for (e.g., Q-1234)."
                    }
                },
                required: ["defectquotenum"]
            }
        }];
    }

    /**
     * Executes the webhook request for finding the task from an anctioned defect quote
     * @param {Object} args - The arguments containing the defect quote number.
     * @returns {Promise<Object>} - A promise that resolves with the webhook response.
     * @throws {ApplicationError} If the request fails or there's an error.
     */
    async execute(args) {
        try {
            const { defectquotenum } = args;
            const webhookUrl = 'https://n8n-production-ecbc.up.railway.app/webhook/9b53d35f-c910-4593-8437-1e6bfdd485c4';
            const url = `${webhookUrl}?defectquotenum=${encodeURIComponent(defectquotenum)}`;
            Logger.info(`defect_quote_output_task: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new ApplicationError(
                    `Defect quote output task check failed: ${response.status} - ${errorText}`,
                    ErrorCodes.API_REQUEST_FAILED,
                    { url, status: response.status, statusText: response.statusText, body: errorText }
                );
            }

            const data = await response.json();
            Logger.info('Defect quote putput task status response', data); // Typo in log message 'putput' -> 'output'
            return data;
        } catch (error) {
            Logger.error('Defect quote output task check failed', error);
            throw new ApplicationError(
                `Defect quote output task status check failed: ${error.message}`,
                ErrorCodes.API_REQUEST_FAILED,
                { originalError: error }
            );
        }
    }
}
--- START OF FILE tool-manager.js ---
import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';
import { GoogleSearchTool } from './google-search.js';
import { WeatherTool } from './weather-tool.js';
import { TaskWebhookTool } from './webhook-tool-task-check.js';
import { DefectQuoteWebhookTool } from './webhook-tool-defect-check.js'; // Separate import for clarity
import { defect_quote_output_taskTool } from './defect_quote_output_task.js'; // Corrected import - Class name matches

export class ToolManager {
    constructor() {
        this.tools = new Map();
        this.registerDefaultTools();
    }

    registerDefaultTools() {
        this.registerTool('googleSearch', new GoogleSearchTool());
        this.registerTool('weather', new WeatherTool());
        this.registerTool('task_status', new TaskWebhookTool()); // Task checking tool
        this.registerTool('defect_quote', new DefectQuoteWebhookTool()); // Defect quote tool
        this.registerTool('defect_quote_output_task', new defect_quote_output_taskTool()); // Registered new tool - class name matches
    }

    registerTool(name, toolInstance) {
        if (this.tools.has(name)) {
            throw new ApplicationError(
                `Tool ${name} is already registered`,
                ErrorCodes.INVALID_STATE
            );
        }
        this.tools.set(name, toolInstance);
        Logger.info(`Tool ${name} registered successfully`);
    }

    getToolDeclarations() {
        const allDeclarations = [];

        this.tools.forEach((tool, name) => {
            if (tool.getDeclaration) {
                // Handle multi-function tools
                if (['weather', 'task_status', 'defect_quote', 'defect_quote_output_task'].includes(name)) { // Include the new tool here
                    const declarations = tool.getDeclaration();
                    if (Array.isArray(declarations)) { // Check if getDeclaration returns an array
                        allDeclarations.push(...declarations.map(functionDeclaration => ({ functionDeclarations: [functionDeclaration] }))); // Wrap each declaration in functionDeclarations
                    } else {
                        allDeclarations.push({ functionDeclarations: [declarations] }); // Wrap single declaration in functionDeclarations
                    }
                } else {
                    allDeclarations.push({ [name]: tool.getDeclaration() });
                }
            }
        });

        return allDeclarations;
    }

    async handleToolCall(functionCall) {
        const { name, args, id } = functionCall;
        Logger.info(`Handling tool call: ${name}`, { args });

        let tool;
        switch(name) {
            case 'get_weather_on_date':
                tool = this.tools.get('weather');
                break;
            case 'check_task_status':
                tool = this.tools.get('task_status');
                break;
            case 'defect_quote_status_checker':
                tool = this.tools.get('defect_quote');
                break;
            case 'defect_quote_output_task_checker': // Correct function name to match declaration
                tool = this.tools.get('defect_quote_output_task');
                break;
            default:
                tool = this.tools.get(name);
        }

        if (!tool) {
            throw new ApplicationError(
                `Unknown tool: ${name}`,
                ErrorCodes.INVALID_PARAMETER
            );
        }

        try {
            const result = await tool.execute(args);
            return {
                functionResponses: [{
                    response: { output: result },
                    id
                }]
            };
        } catch (error) {
            Logger.error(`Tool execution failed: ${name}`, error);
            return {
                functionResponses: [{
                    response: { error: error.message },
                    id
                }]
            };
        }
    }
}
