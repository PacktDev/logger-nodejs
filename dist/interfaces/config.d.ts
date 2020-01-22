export interface IConfig {
    invocationId?: string;
    serviceName?: string;
    elasticLoggingUrl?: string;
    pingTimeout?: number;
    requestTimeout?: number;
    flushInterval?: number;
}
