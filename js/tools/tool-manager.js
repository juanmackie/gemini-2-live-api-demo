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
                // Get the declaration(s) for the tool
                const declarations = tool.getDeclaration();

                // Add the declaration(s) to the flat array
                if (Array.isArray(declarations)) {
                    // If getDeclaration returns an array (for multi-function tools), spread its elements
                    allDeclarations.push(...declarations);
                } else if (declarations) {
                    // If getDeclaration returns a single object, push it directly
                    allDeclarations.push(declarations);
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
