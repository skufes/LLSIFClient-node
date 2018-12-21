class HttpClientError extends Error {
    constructor(message, resp) {
        super(message)
        this.resp = resp
    }
}

class WrongRequestParamsError extends HttpClientError {
    constructor(message, resp) {
        super(message, resp)
    }
}

class ServerOnMaintenenceError extends HttpClientError {
    constructor(message, resp) {
        super(message, resp)
    }
}

class OutDatedClientError extends HttpClientError {
    constructor(message, resp) {
        super(message, resp)
    }
}

module.exports = { ServerOnMaintenenceError, WrongRequestParamsError, HttpClientError }