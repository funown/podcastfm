class NotFoundError extends Error {
  constructor(message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = 'NotFoundError'
  }
}

module.exports = NotFoundError;