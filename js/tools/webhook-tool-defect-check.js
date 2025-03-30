import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';

/**
 * Represents a tool for checking defect quote status via webhook.
 */
export class DefectQuoteWebhookTool { // Rename the class
    /**
     * Returns the tool declaration for defect quote status checking.
     * @returns {Object} An object defining the tool's function.
     */
    getDeclaration() {
        return [{
            name: "defect_quote_status_checker",
            description: "Checks the status of a defect quote using the defect quote number (e.g., Q-1234).Status' DRAFT= Actively being created by Auscoast Fire, Submitted= Ready for client review and approval, Actioned= The quote has been approved, and the works are to follow, Expired= The quote has expired due to no action and will need to be resubmitted",
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
     * Executes the webhook request for defect quote status.
     * @param {Object} args - The arguments containing the defect quote number.
     * @returns {Promise<Object>} - A promise that resolves with the webhook response.
     * @throws {ApplicationError} If the request fails or there's an error.
     */
    async execute(args) {
        try {
            const { defectquotenum } = args;
            const webhookUrl = 'https://n8n-production-ecbc.up.railway.app/webhook/415b5710-7c96-4445-a7f8-a19706890544';
            const url = `${webhookUrl}?defectquotenum=${encodeURIComponent(defectquotenum)}`;
            Logger.info(`Defect quote status check: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new ApplicationError(
                    `Defect quote check failed: ${response.status} - ${errorText}`,
                    ErrorCodes.API_REQUEST_FAILED,
                    { url, status: response.status, statusText: response.statusText, body: errorText }
                );
            }

            const data = await response.json();
            Logger.info('Defect quote status response', data);
            return data;
        } catch (error) {
            Logger.error('Defect quote check failed', error);
            throw new ApplicationError(
                `Defect quote status check failed: ${error.message}`,
                ErrorCodes.API_REQUEST_FAILED,
                { originalError: error }
            );
        }
    }
}
