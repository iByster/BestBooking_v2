import winston, { format, Logger } from 'winston';
import { colorizeString, StringColor } from './colorizeString';

class MyLogger {
  private logger: Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'level',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(info => {
          const { timestamp, level, message, stack } = info;

          const colors: { [key: string]: any } = {
            info: 'green',
            error: 'red',
            debug: 'light-blue',
            warn: 'yellow',
          };

          const logMessage = `${timestamp} [${this.colorizeLog(level.toUpperCase(), colors[level])}]: ${message}`;
          return stack ? `${logMessage}\n${stack}` : logMessage;
        })
      ),
      transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'logs.log' })
      ]
    });
  }

  public log(message: string): void {
    this.logger.info(message);
  }

  public error(message: string, error?: Error): void {
    this.logger.error(message, { error });
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public colorizeLog(str: string, color: StringColor) {
    return colorizeString(str, color);
  }
}

export default new MyLogger();