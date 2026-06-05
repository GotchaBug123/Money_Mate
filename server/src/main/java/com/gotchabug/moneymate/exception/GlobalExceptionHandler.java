package com.gotchabug.moneymate.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 잘못된 인자값 (존재하지 않는 회원/자산 등)
     * CartService, InterestService 에서 throw 함
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status", 400,
                        "error", "Bad Request",
                        "message", e.getMessage(),
                        "timestamp", LocalDateTime.now().toString()
                ));
    }

    /**
     * ResponseStatusException (401, 404 등 직접 지정한 예외)
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(ResponseStatusException e) {
        return ResponseEntity
                .status(e.getStatusCode())
                .body(Map.of(
                        "status", e.getStatusCode().value(),
                        "error", e.getReason() != null ? e.getReason() : "Error",
                        "message", e.getMessage(),
                        "timestamp", LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> fieldErrors = new HashMap<>();

        e.getBindingResult()
                .getFieldErrors()
                .forEach(error -> fieldErrors.put(
                        error.getField(),
                        error.getDefaultMessage()
                ));

        e.getBindingResult()
                .getGlobalErrors()
                .forEach(error -> fieldErrors.put(
                        error.getObjectName(),
                        error.getDefaultMessage()
                ));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status", 400,
                        "error", "Validation Failed",
                        "message", "요청 값이 올바르지 않습니다.",
                        "errors", fieldErrors,
                        "timestamp", LocalDateTime.now().toString()
                ));
    }

    @ExceptionHandler({
            NoHandlerFoundException.class,
            NoResourceFoundException.class
    })
    public ResponseEntity<Map<String, Object>> handleNotFound(Exception e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "status", 404,
                        "error", "Not Found",
                        "message", "요청한 경로를 찾을 수 없습니다.",
                        "timestamp", LocalDateTime.now().toString()
                ));
    }

    /**
     * 그 외 예상치 못한 서버 에러
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "status", 500,
                        "error", "Internal Server Error",
                        "message", e.getMessage() != null ? e.getMessage() : "서버 오류가 발생했습니다.",
                        "timestamp", LocalDateTime.now().toString()
                ));
    }
}
