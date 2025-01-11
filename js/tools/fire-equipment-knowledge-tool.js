import { Pinecone } from '@pinecone-database/pinecone';
import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';
import CONFIG from '../../config.js';


/**
 * Represents a tool for querying a Pinecone vector database about fire equipment.
 */
export class FireEquipmentKnowledgeTool {
    constructor() {
        this.pinecone = null;
        this.pineconeIndex = null;
        this.initPinecone();
    }


    /**
     * Initializes the Pinecone client and index.
     * @throws {ApplicationError} Throws an error if any of the environment variables are missing
     */
     initPinecone() {
        if (!CONFIG.PINECONE.API_KEY) {
          throw new ApplicationError(
            'Missing PINECONE_API_KEY in config.js',
            ErrorCodes.MISSING_ENV_VAR
          );
        }
    
        if (!CONFIG.PINECONE.ENVIRONMENT) {
            throw new ApplicationError(
              'Missing PINECONE_ENVIRONMENT in config.js',
              ErrorCodes.MISSING_ENV_VAR
            );
          }
    
          if (!CONFIG.PINECONE.INDEX) {
            throw new ApplicationError(
              'Missing PINECONE_INDEX in config.js',
              ErrorCodes.MISSING_ENV_VAR
            );
          }
        try {
            this.pinecone = new Pinecone({
                apiKey: CONFIG.PINECONE.API_KEY,
                environment: CONFIG.PINECONE.ENVIRONMENT,
            });

             this.pineconeIndex = this.pinecone.index(CONFIG.PINECONE.INDEX);

             Logger.info('Pinecone client initialized successfully.');

        } catch (error) {
            Logger.error('Pinecone client initialization failed', error);
            throw new ApplicationError(
                'Pinecone client initialization failed',
                ErrorCodes.PINECONE_INIT_FAILED,
                { originalError: error}
            );
        }
    }

    /**
     * Returns the tool declaration for the Gemini API.
     * Defines a function to query the knowledge base.
     *
     * @returns {Object[]} An array of function declarations.
     */
    getDeclaration() {
        return [
            {
                name: "query_knowledge_base",
                description: "Queries the fire equipment knowledge base for information.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The query to search for in the knowledge base."
                        }
                    },
                    required: ["query"]
                }
            }
        ];
    }

    /**
     * Executes the tool, querying the knowledge base.
     *
     * @param {Object} args - The arguments for the tool.
     * @param {string} args.query - The query to search in the knowledge base.
     * @param {string} functionName - The name of the function to execute
     * @returns {Promise<Object>} A promise that resolves with the result of the operation.
     * @throws {Error} Throws an error if the tool execution fails.
     */
    async execute(args, functionName) {
        try {
            Logger.info(`Executing FireEquipmentKnowledgeTool: ${functionName}`, args);
            if (functionName === "query_knowledge_base"){
               return this.queryKnowledgeBase(args.query);
            } else{
               throw new Error (`Unknown function: ${functionName}`)
            }

        } catch (error) {
            Logger.error('FireEquipmentKnowledgeTool failed', error);
            throw error;
        }
    }

    /**
     * Queries the Pinecone vector database.
     * @param {string} query - The query string.
     * @returns {Promise<string>} - Returns the matching sections of the knowledge base or a no result message.
     */
    async queryKnowledgeBase(query) {
        if (!this.pineconeIndex) {
            return "Pinecone index is not initialized.";
        }
    
       try {
            // Assuming you have an embedding function
            const queryVector = await this.generateEmbeddings(query);
            const queryResponse = await this.pineconeIndex.query({
                vector: queryVector,
                topK: 3, // Get the top 3 matches
            });
    
             if (!queryResponse || !queryResponse.matches || queryResponse.matches.length === 0) {
              return `No information found related to "${query}".`;
             }
    
            const results = queryResponse.matches.map(match => match.metadata.text).filter(Boolean);
      
            if (results.length === 0) {
              return `No relevant information found related to "${query}".`;
            }
          
            return results.join("\n");

        } catch (error) {
            Logger.error('Pinecone query failed', error);
            throw new ApplicationError(
                `Pinecone query failed: ${error.message}`,
                 ErrorCodes.PINECONE_QUERY_FAILED,
                 { originalError: error}
              );
        }
      
    }


    /**
     * Placeholder for the embedding function.
     * In a real implementation, you'd use an embedding model here.
     * @param {string} text - The text to embed.
     * @returns {Promise<number[]>} - A promise that resolves with the embedding vector.
     */
    async generateEmbeddings(text) {
        // This is a placeholder; you need to replace this with an actual embedding model call.
        // This is needed to convert your query text into vector embeddings.
         const placeholderVector = Array.from({ length: 1536 }, () => Math.random()); // Example 1536-dimensional vector, typical for OpenAI
         return Promise.resolve(placeholderVector);
    }
}
