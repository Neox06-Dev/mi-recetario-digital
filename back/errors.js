// Error con codigo de estado para que los controladores sepan que responder
export function httpError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}
