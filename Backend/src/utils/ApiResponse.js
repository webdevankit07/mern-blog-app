class ApiResponse {
    constructor(statusCode, data, message = 'success') {
        this.status = statusCode;
        data && (this.data = data);
        this.message = message;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;
