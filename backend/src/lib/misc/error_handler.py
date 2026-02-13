from fastapi import HTTPException, status

class APIError:    
    @staticmethod
    def validation_error(detail: str) -> HTTPException:
        """Return 400 Bad Request for validation errors"""
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )
    
    @staticmethod
    def unauthorized(detail: str = "Authentication required") -> HTTPException:
        """Return 401 Unauthorized"""
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail
        )
    
    @staticmethod
    def forbidden(detail: str = "Access denied") -> HTTPException:
        """Return 403 Forbidden"""
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )
    
    @staticmethod
    def not_found(resource: str) -> HTTPException:
        """Return 404 Not Found"""
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} not found"
        )
    
    @staticmethod
    def conflict(detail: str) -> HTTPException:
        """Return 409 Conflict"""
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )
    
    @staticmethod
    def server_error(detail: str = "An error occurred processing your request") -> HTTPException:
        """Return 500 Internal Server Error"""
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )


class ErrorMessage:
    """Standardized error messages"""
    
    # Auth errors
    PENDING_USER_ALREADY_EXISTS = "An email verification link has already been sent for this user"
    VERIFIED_USER_ALREADY_EXISTS = "Either your email or username is already being used"
    INVALID_CREDENTIALS = "Incorrect email, username, or password"
    PASSWORD_WEAK = "Password does not meet strength requirements"
    REFRESH_TOKEN_MISSING = "Refresh token not found"
    INVALID_TOKEN = "Invalid or expired token"
    UNAUTHORIZED = "Authentication required"
    
    # Validation errors
    INVALID_ID = "Invalid ID format"
    INVALID_EMAIL = "Invalid email format"
    EMPTY_INPUT = "Input cannot be empty"
    NO_DATA_PROVIDED = "No data provided to update"
    
    # Resource errors
    USER_NOT_FOUND = "User not found"
    WORKOUT_NOT_FOUND = "Workout not found"
    SETTINGS_NOT_FOUND = "Settings not found"
    RESOURCE_NOT_OWNED = "Resource not found or not owned by user"
    ENTRY_WITH_NAME_ALREADY_EXISTS = "An entry with the name '{name}' already exists on the same date"
    
    # Operation errors
    FAILED_TO_CREATE = "Failed to create resource"
    FAILED_TO_UPDATE = "Failed to update resource"
    FAILED_TO_DELETE = "Failed to delete resource"
    FAILED_TO_RETRIEVE = "Failed to retrieve resource"
    LIMIT_EXCEEDED = "Limit exceeded: {limit}"