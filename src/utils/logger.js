// Logging utility for Bluesky Connect

/**
 * Log levels
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * Current log level 
 * Can be changed at runtime
 */
let currentLogLevel = LOG_LEVELS.DEBUG;

/**
 * Whether to include timestamps in logs
 */
let includeTimestamps = true;

/**
 * Logger class for Bluesky Connect
 */
class Logger {
  

  /**
   * Create formatted log message
   * @private
   * @param {string} level - Log level label
   * @param {string} message - Log message
   * @param {any} [data] - Additional data to log
   * @returns {string} Formatted log message
   */
  _formatMessage(level, message, data) {
    const name = chrome.runtime.getManifest().name;
    const timestamp = includeTimestamps ? `[${new Date().toISOString()}]` : '';
    // Make sure to include the message in the prefix
    const prefix = `${timestamp}[${name}][${level}] ${message}`;
    
    return data ? `${prefix}` : prefix;
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {any} [data] - Additional data to log
   */
  debug(message, data) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      if (data) {
        console.debug(this._formatMessage('DEBUG', message), data);
      } else {
        console.debug(this._formatMessage('DEBUG', message));
      }
    }
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {any} [data] - Additional data to log
   */
  info(message, data) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      if (data) {
        console.info(this._formatMessage('INFO', message), data);
      } else {
        console.info(this._formatMessage('INFO', message));
      }
    }
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {any} [data] - Additional data to log
   */
  warn(message, data) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      if (data) {
        console.warn(this._formatMessage('WARN', message), data);
      } else {
        console.warn(this._formatMessage('WARN', message));
      }
    }
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {any} [data] - Additional data to log
   */
  error(message, data) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      if (data) {
        console.error(this._formatMessage('ERROR', message), data);
      } else {
        console.error(this._formatMessage('ERROR', message));
      }
    }
  }

  /**
   * Set log level
   * @param {string} level - Log level ('debug', 'info', 'warn', 'error')
   */
  setLevel(level) {
    switch (level.toLowerCase()) {
      case 'debug':
        currentLogLevel = LOG_LEVELS.DEBUG;
        break;
      case 'info':
        currentLogLevel = LOG_LEVELS.INFO;
        break;
      case 'warn':
        currentLogLevel = LOG_LEVELS.WARN;
        break;
      case 'error':
        currentLogLevel = LOG_LEVELS.ERROR;
        break;
      default:
        console.warn(`[Sky Connect] Unknown log level: ${level}`);
    }
  }

  /**
   * Toggle timestamps in logs
   * @param {boolean} include - Whether to include timestamps
   */
  setTimestamps(include) {
    includeTimestamps = include;
  }
}

// Create and expose a global logger instance
window.logger = new Logger();