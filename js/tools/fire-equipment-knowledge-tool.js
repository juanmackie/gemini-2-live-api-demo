import { Logger } from '../utils/logger.js';

/**
 * Represents a tool for managing and querying a knowledge base about fire equipment.
 */
export class FireEquipmentKnowledgeTool {
    constructor() {
        this.knowledgeBase = ""; // Initialize an empty knowledge base
    }

    /**
     * Returns the tool declaration for the Gemini API.
     * Defines two functions: one to add to the knowledge base, and one to query it.
     *
     * @returns {Object[]} An array of function declarations.
     */
    getDeclaration() {
        return [
            {
                name: "add_to_knowledge_base",
                description: "Adds text to the fire equipment knowledge base.",
                parameters: {
                    type: "object",
                    properties: {
                        text: {
                            type: "string",
                            description: "The text to add to the knowledge base."
                        }
                    },
                    required: ["text"]
                }
            },
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
     * Executes the tool, either adding to the knowledge base or querying it.
     *
     * @param {Object} args - The arguments for the tool.
     * @param {string} args.text - The text to add to the knowledge base (for add_to_knowledge_base).
     * @param {string} args.query - The query to search in the knowledge base (for query_knowledge_base).
     * @param {string} functionName - The name of the function to execute
     * @returns {Promise<Object>} A promise that resolves with the result of the operation.
     * @throws {Error} Throws an error if the tool execution fails.
     */
    async execute(args, functionName) {
        try {
            Logger.info(`Executing FireEquipmentKnowledgeTool: ${functionName}`, args);
            
            if (functionName === "add_to_knowledge_base") {
               return this.addTextToKnowledgeBase(args.text);
            }
            else if (functionName === "query_knowledge_base"){
               return this.queryKnowledgeBase(args.query);
            }
             else{
               throw new Error (`Unknown function: ${functionName}`)
            }

        } catch (error) {
            Logger.error('FireEquipmentKnowledgeTool failed', error);
            throw error;
        }
    }

      /**
     * Adds text to the knowledge base.
     * @param {string} text - The text to add.
     * @returns {Promise<string>} - Returns a success message.
     */
    async addTextToKnowledgeBase(text){
         this.knowledgeBase += text + "\n";
         return `Added to knowledge base.`
    }

    /**
     * Queries the knowledge base.
     * @param {string} query - The query string.
     * @returns {Promise<string>} - Returns the matching sections of the knowledge base or a no result message.
     */
    async queryKnowledgeBase(query) {
      
        if (!this.knowledgeBase) {
            return "The knowledge base is empty.";
          }
      
        const results = this.search(query);
         
      
        if (results.length === 0) {
          return `No information found related to "${query}".`;
        }
        
        return results.join("\n");
    }

    /**
     * Searches the knowledge base for the given query
     * @param {string} query - The query string.
     * @returns {Array<string>} - An array containing matching sections.
    */
    search(query) {
        const queryLower = query.toLowerCase();
        const sections = this.knowledgeBase.split('\n').filter(Boolean);
        return sections.filter(section => section.toLowerCase().includes(queryLower))
    }
}
