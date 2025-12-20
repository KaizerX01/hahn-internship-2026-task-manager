package com.hahn.projectmanager.exception;

public enum ErrorCode {

    // Auth
    AUTHENTICATION_FAILED,
    CONFLICT,

    // Validation
    VALIDATION_ERROR,

    // Domain
    PROJECT_NOT_FOUND,
    TASK_NOT_FOUND,
    ACCESS_DENIED,

    // Generic
    RESOURCE_NOT_FOUND,
    INTERNAL_ERROR
}
