package com.gotchabug.moneymate.admin.service;

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

    public List<CustomerInquiry> getAllInquiries() {
        return customerInquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    public CustomerInquiry getInquiry(Long inquiryId) {
        return customerInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다."));
    }

    @Transactional
    public void answerInquiry(Long inquiryId, String answer) {
        CustomerInquiry inquiry = customerInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new IllegalArgumentException("문의가 존재하지 않습니다."));

        inquiry.answer(answer);
    }
}