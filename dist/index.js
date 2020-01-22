"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable radix */
var winston_1 = __importDefault(require("winston"));
var winston_elasticsearch_1 = __importDefault(require("winston-elasticsearch"));
var elasticsearch_1 = require("@elastic/elasticsearch");
var debug_1 = __importDefault(require("debug"));
var logform_1 = require("logform");
var uuid_1 = __importDefault(require("uuid"));
/**
 * Logger Class
 */
var default_1 = /** @class */ (function () {
    /**
     * Creates a useable instance for logging
     */
    function default_1(config) {
        this.serviceName = (config.serviceName || process.env.ELASTIC_LOGGING_SERVICE_NAME || '').trim();
        this.debugInstance = {};
        this.invocationId = config.invocationId;
        if (!this.invocationId) {
            this.invocationId = uuid_1.default();
        }
        var transports = [];
        var consoleTransport = new winston_1.default.transports.Console();
        transports.push(consoleTransport);
        if (config.elasticLoggingUrl || process.env.ELASTIC_LOGGING_URL) {
            // Date
            var date = new Date();
            // Index Name
            this.indexName = "logs-" + this.serviceName + "-" + date.toISOString().split('T').shift();
            // check the index exists
            this.esClient = new elasticsearch_1.Client({
                node: config.elasticLoggingUrl || process.env.ELASTIC_LOGGING_URL,
                pingTimeout: config.pingTimeout || parseInt(process.env.ELASTIC_PING_TIMEOUT) || 2000,
                requestTimeout: config.requestTimeout || parseInt(process.env.ELASTIC_REQUEST_TIMEOUT) ||
                    2000,
            });
            // Transporter
            var esTransport = new winston_elasticsearch_1.default({
                index: this.indexName,
                client: this.esClient,
                buffering: false,
                flushInterval: config.flushInterval || parseInt(process.env.ELASTIC_FLUSH_INTERVAL) ||
                    500,
            });
            transports.push(esTransport);
        }
        this.winstonLogger = winston_1.default.createLogger({
            level: 'silly',
            transports: transports,
            format: logform_1.format.combine(logform_1.format.errors({ stack: true }), logform_1.format.metadata(), logform_1.format.json()),
        });
    }
    /**
     * Logger for the application
     * @param {string} level The level of reporting
     * @param {any} content THe messages to write to stdout
     * @returns {Void}
     */
    default_1.prototype.logger = function (level) {
        var content = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            content[_i - 1] = arguments[_i];
        }
        // Log
        if (!this.debugInstance[level.toLowerCase()]) {
            this.debugInstance[level.toLowerCase()] = debug_1.default(this.serviceName + ":" + level);
        }
        // Correct for single array instance
        var data = (content.length === 1) ? content[0] : content;
        // Debug Log
        this.debugInstance[level.toLowerCase()](data);
        /* istanbul ignore else */
        if (this.winstonLogger) {
            try {
                switch (level.toUpperCase()) {
                    case 'ERROR':
                        this.winstonLogger.error(data, { invocationId: this.invocationId });
                        break;
                    case 'INFO':
                        this.winstonLogger.info(data, { invocationId: this.invocationId });
                        break;
                    case 'DEBUG':
                    default:
                        this.winstonLogger.debug(data, { invocationId: this.invocationId });
                        break;
                }
            }
            catch (error) {
                debug_1.default(this.serviceName + ":ERROR")(error);
            }
        }
    };
    /**
     * Sets the invocation ID for use within the logs
     * @param invocationId
     */
    default_1.prototype.setInvocationId = function (invocationId) {
        this.invocationId = invocationId;
    };
    /**
     * Helpful wrapper for debug severity
     * @param content
     */
    default_1.prototype.debug = function () {
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        return this.logger('DEBUG', content);
    };
    /**
     * Helpful wrapper for log severity
     * @param content
     */
    default_1.prototype.log = function () {
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        return this.logger('LOG', content);
    };
    /**
     * Helpful wrapper for info severity
     * @param content
     */
    default_1.prototype.info = function () {
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        return this.logger('INFO', content);
    };
    /**
     * Helpful wrapper for error severity
     * @param content
     */
    default_1.prototype.error = function () {
        var content = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            content[_i] = arguments[_i];
        }
        return this.logger('ERROR', content);
    };
    /**
     * Returns the Winston Logger
     */
    default_1.prototype.getLogger = function () {
        return this.winstonLogger;
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=index.js.map