export class ApiError extends Error {
  readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}
