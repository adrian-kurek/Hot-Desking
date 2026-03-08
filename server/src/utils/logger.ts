import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = this.createLogger();
  }
  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
      }),
      new DailyRotateFile({
        level: "error",
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
    ];

    return winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "desk-service" },
      transports,
    });
  }
  public error(message: string, meta: object = {}): void {
    this.logger.error(message, { ...meta });
  }

  public info(message: string, meta: object = {}): void {
    this.logger.info(message, { ...meta });
  }
}
