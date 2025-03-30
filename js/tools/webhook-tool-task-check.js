import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';

/**
 * Represents a tool for making requests to a webhook URL.
 */
export class TaskWebhookTool { // Match the imported name
    /**
     * Returns the tool declaration for the Gemini API.
     * @returns {Object} An object defining the tool's function.
     */
    getDeclaration() {
        return [{
            name: "check_task_status",
            description: "Checks the status of a task using a given task ID.Only send numbers to the webhook,if a user gives you an ID eg. T-12345 just send 12345 to the webhook",
            parameters: {
                type: "object",
                properties: {
                    taskId: {
                        type: "string",
                        description: "The ID of the task to check."
                    }
                },
                required: ["taskId"]
            }
        }];
    }

    /**
     * Executes the webhook request.
     * @param {Object} args - The arguments for the tool, including the task ID.
     * @returns {Promise<Object>} - A promise that resolves with the webhook response.
     * @throws {ApplicationError} If the request fails or there's an error.
     */
    async execute(args) {
        try {
            const { taskId } = args;
            const webhookUrl = 'https://n8n-production-ecbc.up.railway.app/webhook/842c8ac9-f4eb-412a-897b-ce73683a10c1'; // Your webhook URL
            const url = `${webhookUrl}?taskId=${taskId}`;
            Logger.info(`Webhook request: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text()
                throw new ApplicationError(
                    `Webhook request failed with status: ${response.status} - ${errorText}`,
                    ErrorCodes.API_REQUEST_FAILED,
                    { url, status: response.status, statusText: response.statusText, body: errorText }
                );
            }

            const data = await response.json();
            Logger.info('Webhook response', data);
            return data;
        } catch (error) {
            Logger.error('Webhook request failed', error);
            throw new ApplicationError(
                `Webhook request failed: ${error.message}`,
                ErrorCodes.API_REQUEST_FAILED,
                { originalError: error }
            );
        }
    }
}
