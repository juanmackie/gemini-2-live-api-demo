import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';
import { GoogleSearchTool } from './google-search.js';
import { WeatherTool } from './weather-tool.js';
import { TaskWebhookTool } from './webhook-tool-task-check.js';
import { DefectQuoteWebhookTool } from './webhook-tool-defect-check.js'; // Separate import for clarity

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
                if (['weather', 'task_status', 'defect_quote'].includes(name)) {
                    allDeclarations.push({
                        functionDeclarations: tool.getDeclaration()
                    });
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
