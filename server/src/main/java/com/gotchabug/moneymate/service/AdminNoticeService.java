package com.gotchabug.moneymate.service;

import com.gotchabug.moneymate.dto.admin.notice.NoticeCreateRequest;
import com.gotchabug.moneymate.dto.admin.notice.NoticeResponse;
import com.gotchabug.moneymate.dto.admin.notice.NoticeUpdateRequest;
import com.gotchabug.moneymate.entity.Notice;
import com.gotchabug.moneymate.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminNoticeService {

    private final NoticeRepository noticeRepository;

    public List<NoticeResponse> getNotices() {
        return noticeRepository
                .findByActiveYnOrderByImportantYnDescCreatedAtDesc("Y")
                .stream()
                .map(NoticeResponse::from)
                .toList();
    }

    @Transactional
    public NoticeResponse getNotice(Long noticeId) {
        Notice notice = findActiveNotice(noticeId);
        notice.increaseViewCount();

        return NoticeResponse.from(notice);
    }

    @Transactional
    public NoticeResponse createNotice(NoticeCreateRequest request) {
        Notice notice = Notice.builder()
                .title(normalizeRequired(request.getTitle(), "title"))
                .content(normalizeRequired(request.getContent(), "content"))
                .importantYn(toYn(request.getImportant()))
                .activeYn("Y")
                .viewCount(0L)
                .build();

        Notice savedNotice = noticeRepository.save(notice);

        return NoticeResponse.from(savedNotice);
    }

    @Transactional
    public NoticeResponse updateNotice(
            Long noticeId,
            NoticeUpdateRequest request
    ) {
        Notice notice = findActiveNotice(noticeId);

        notice.update(
                normalizeRequired(request.getTitle(), "title"),
                normalizeRequired(request.getContent(), "content"),
                toYn(request.getImportant())
        );

        return NoticeResponse.from(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        Notice notice = findActiveNotice(noticeId);
        notice.delete();
    }

    private Notice findActiveNotice(Long noticeId) {
        return noticeRepository.findByNoticeIdAndActiveYn(noticeId, "Y")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notice not found."
                ));
    }

    private String toYn(Boolean value) {
        return Boolean.TRUE.equals(value) ? "Y" : "N";
    }

    private String normalizeRequired(
            String value,
            String fieldName
    ) {
        String normalizedValue = normalize(value);

        if (normalizedValue == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " is required."
            );
        }

        return normalizedValue;
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}