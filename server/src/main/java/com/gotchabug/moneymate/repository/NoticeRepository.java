package com.gotchabug.moneymate.repository;

import com.gotchabug.moneymate.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findByActiveYnOrderByImportantYnDescCreatedAtDesc(String activeYn);

    Optional<Notice> findByNoticeIdAndActiveYn(Long noticeId, String activeYn);
}