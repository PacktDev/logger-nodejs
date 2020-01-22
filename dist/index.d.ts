import winston from 'winston';
import { IConfig } from './interfaces/config';
/**
 * Logger Class
 */
export default class {
    private winstonLogger;
    private indexName;
    private esClient;
    private serviceName;
    private debugInstance;
    private invocationId;
    /**
     * Creates a useable instance for logging
     */
    constructor(config: IConfig);
    /**
     * Logger for the application
     * @param {string} level The level of reporting
     * @param {any} content THe messages to write to stdout
     * @returns {Void}
     */
    logger(level: string, ...content: any): void;
    /**
     * Sets the invocation ID for use within the logs
     * @param invocationId
     */
    setInvocationId(invocationId: string): void;
    /**
     * Helpful wrapper for debug severity
     * @param content
     */
    debug(...content: any): void;
    /**
     * Helpful wrapper for log severity
     * @param content
     */
    log(...content: any): void;
    /**
     * Helpful wrapper for info severity
     * @param content
     */
    info(...content: any): void;
    /**
     * Helpful wrapper for error severity
     * @param content
     */
    error(...content: any): void;
    /**
     * Returns the Winston Logger
     */
    getLogger(): winston.Logger;
}
