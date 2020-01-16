/* eslint-disable radix */
import winston from 'winston';
import Elasticsearch from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';
import Debug from 'debug';
import { format } from 'logform';
import { IConfig } from './interfaces/config';
/**
 * Logger Class
 */
export default class {
    private winstonLogger: winston.Logger;
    private indexName: string;
    private esClient: Client;
    private serviceName: string;
    private debugInstance: any;
    private invocationId: string;

    /**
     * Creates a useable instance for logging
     */
    constructor(config: IConfig) {
      this.serviceName = (config.serviceName || process.env.ELASTIC_LOGGING_SERVICE_NAME || '').trim();
      this.debugInstance = {};
      this.invocationId = config.invocationId;

      const transports = [];

      const consoleTransport = new winston.transports.Console();
      transports.push(consoleTransport);

      if (config.elasticLoggingUrl || process.env.ELASTIC_LOGGING_URL) {
        // Date
        const date = new Date();

        // Index Name
        this.indexName = `logs-${this.serviceName}-${date.toISOString().split('T').shift()}`;

        // check the index exists
        this.esClient = new Client({
          node: config.elasticLoggingUrl || process.env.ELASTIC_LOGGING_URL,
          pingTimeout: config.pingTimeout || parseInt(process.env.ELASTIC_PING_TIMEOUT) || 2000,
          requestTimeout: config.requestTimeout || parseInt(process.env.ELASTIC_REQUEST_TIMEOUT) || 2000,
        });

        // Transporter
        const esTransport = new Elasticsearch({
          index: this.indexName,
          client: this.esClient,
          buffering: false,
          flushInterval: config.flushInterval || parseInt(process.env.ELASTIC_FLUSH_INTERVAL) || 500,
        });
        transports.push(esTransport);
      }

      this.winstonLogger = winston.createLogger({
        level: 'silly',
        transports,
        format: format.combine(
          format.errors({ stack: true }),
          format.metadata(),
          format.json(),
        ),
      });
    }

    /**
     * Logger for the application
     * @param {string} level The level of reporting
     * @param {any} content THe messages to write to stdout
     * @returns {Void}
     */
    public logger(level: string, content: any): void {
      // Add the invocationId to the data object
      const { invocationId } = this;

      // Log
      if (!this.debugInstance[level.toLowerCase()]) {
        this.debugInstance[level.toLowerCase()] = Debug(`${this.serviceName}:${level}`);
      }

      // Correct for single array instance
      const data = (content.length === 1) ? content[0] : content;

      // Debug Log
      this.debugInstance[level.toLowerCase()](data);

      /* istanbul ignore else */
      if (this.winstonLogger) {
        try {
          switch (level.toUpperCase()) {
            case 'ERROR':
              this.winstonLogger.error(data, { invocationId });
              break;
            case 'INFO':
              this.winstonLogger.info(data, { invocationId });
              break;
            case 'DEBUG':
            default:
              this.winstonLogger.debug(data, { invocationId });
              break;
          }
        } catch (error) {
          Debug(`${this.serviceName}:ERROR`)(error);
        }
      }
    }

    /**
     * Sets the invocation ID for use within the logs
     * @param invocationId
     */
    public setInvocationId(invocationId: string): void {
      this.invocationId = invocationId;
    }

    /**
     * Helpful wrapper for debug severity
     * @param content
     */
    public debug(...content: any): void {
      return this.logger('DEBUG', content);
    }

    /**
     * Helpful wrapper for log severity
     * @param content
     */
    public log(...content: any): void {
      return this.logger('LOG', content);
    }

    /**
     * Helpful wrapper for info severity
     * @param content
     */
    public info(...content: any): void {
      return this.logger('INFO', content);
    }

    /**
     * Helpful wrapper for error severity
     * @param content
     */
    public error(...content: any): void {
      return this.logger('ERROR', content);
    }

    /**
     * Returns the Winston Logger
     */
    public getLogger(): winston.Logger {
      return this.winstonLogger;
    }
}
