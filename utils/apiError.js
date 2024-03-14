class ApiError extends Error{
    message;
    constructor(
        statusCode,
        message = "Something went wrong",
    ){
        super(message)
        this.data = null
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.error = message
    }
} 
 export default ApiError