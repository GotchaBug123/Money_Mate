package com.gotchabug.moneymate.admin.service;

import com.gotchabug.moneymate.admin.dto.AdminInquiryResponse;
import com.gotchabug.moneymate.customer.entity.CustomerInquiry;
import com.gotchabug.moneymate.customer.repository.CustomerInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInquiryService {

    private final CustomerInquiryRepository customerInquiryRepository;

    public List<AdminInquiryResponse> getAllInquiries() {
        return customerInquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AdminInquiryResponse::from)
                .toList();
    }

    public AdminInquiryResponse getInquiry(Long inquiryId) {
        CustomerInquiry inquiry = customerInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다."));

        return AdminInquiryResponse.from(inquiry);
    }

    @Transactional
    public void answerInquiry(Long inquiryId, String answer) {
        CustomerInquiry inquiry = customerInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다."));

        inquiry.answer(answer);
    }
}