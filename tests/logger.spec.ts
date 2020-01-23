/* eslint-env mocha */

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { Client } from '@elastic/elasticsearch';
import uuid from 'uuid';
import winston from 'winston';
import Logger from '../src/index';

const config = {};
const sandbox = sinon.createSandbox();

let ELASTIC_LOGGING_URL = 'http://localhost:9200/';

describe('Logger', () => {
  beforeEach(() => {
    ELASTIC_LOGGING_URL = 'http://localhost:9200/';
    sandbox.reset();
    sandbox.restore();
  });
  describe('Logger_constructor', () => {
    it('Logger_constructor_success_no_ENV', () => {
      const logger = new Logger(config);
      expect((logger as any).esClient).to.not.be.instanceOf(Client);
    });

    it('Logger_constructor_success_with_ENV', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });

      const date = new Date();
      const logger = new Logger(config);
      expect((logger as any).indexName).to.eql(`logs-${ELASTIC_LOGGING_SERVICE_NAME}-${date.toISOString().split('T').shift()}`);
      expect((logger as any).esClient).to.be.instanceOf(Client);
    });

    it('Logger_constructor_success_with_winstonConsole', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });

      const date = new Date();
      const logger = new Logger({ ...config, winstonConsole: true });
      expect((logger as any).indexName).to.eql(`logs-${ELASTIC_LOGGING_SERVICE_NAME}-${date.toISOString().split('T').shift()}`);
      expect((logger as any).esClient).to.be.instanceOf(Client);
    });

    it('Logger_constructor_success_invocationId', () => {
      const invocationId = uuid();
      const logger = new Logger({ invocationId });
      expect((logger as any).invocationId).to.eql(invocationId);
    });
  });

  describe('Logger_logger', () => {
    it('Logger_logger_success_default', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        log: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(0);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_real_success_default', () => {
      ELASTIC_LOGGING_URL = undefined;
      const ELASTIC_LOGGING_SERVICE_NAME = 'real-log';
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });

      const logger = new Logger(config);
      logger.logger('', 'Hello World');
    });

    it('Logger_logger_success_ERROR', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        error: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('ERROR', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_ERROR_success', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        error: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.error('Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_logger_success_INFO', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        info: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('INFO', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_logger_success_INFO_again', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        info: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('INFO', 'Hello World');
      logger.logger('INFO', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(2);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_logger_success_INFO_multiple_params', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        info: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('INFO', 'Hello World', 'Goodbye, cruel world!');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_INFO_success', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        info: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.info('Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_INFO_success_multiple_params', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        info: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.info('Hello World', 'Goodbye, cruel world!');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_logger_success_DEBUG', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        debug: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('DEBUG', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_DEBUG_success', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        debug: () => {
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.debug('Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_logger_throws', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        error: () => {
          throw Error('Blah');
        },
      } as any);

      const logger = new Logger(config);
      logger.logger('ERROR', 'Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('set_invocationId', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      const invocationId = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      let logCalled = 0;
      const errorFunc = sandbox.stub(winston, 'createLogger').returns({
        debug: (data: any, params: any) => {
          expect(params.invocationId).to.eql(invocationId);
          logCalled += 1;
        },
      } as any);

      const logger = new Logger(config);
      logger.setInvocationId(invocationId);
      logger.debug('Hello World');
      expect((logger as any).esClient).to.be.instanceOf(Client);
      expect(logCalled).to.eql(1);
      expect(errorFunc.callCount).to.be.gte(1);
    });

    it('Logger_getLogger_success', () => {
      const ELASTIC_LOGGING_SERVICE_NAME = uuid();
      sandbox.stub(process, 'env').value({
        ELASTIC_LOGGING_SERVICE_NAME,
        ELASTIC_LOGGING_URL,
      });
      sandbox.stub(winston, 'createLogger').returns({
        debug: () => { },
      } as any);

      const logger = new Logger(config);
      const obj = logger.getLogger();
      expect(obj).to.be.instanceOf(Object);
    });
  });
});
