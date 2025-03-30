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
            description: "Finds the output task from a actioned defect quotes ONLY.Do not use this tool unless the defect is the ACTIONED status, instead use tool webhook-tool-defect-check .This allows checking of tasks originating from actioned defect quotes. Supply the webhook the defect quote number eg: Q-12345 and returns task with approved scope of works",
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

            // Clone the response to read the text without consuming the body
            const responseClone = response.clone();
            const responseText = await responseClone.text();
            Logger.info('Raw defect quote output task response text:', responseText); // Log the raw text

            const data = await response.json(); // Parse JSON from the original response
            Logger.info('Defect quote output task status response JSON:', data); // Log the parsed JSON (Typo fixed)
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
