package com.gotchabug.moneymate.admin.service;

import com.gotchabug.moneymate.customer.repository.CustomerInquiryRepository;
import com.gotchabug.moneymate.customer.repository.FaqRepository;
import com.gotchabug.moneymate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final MemberRepository memberRepository;
    private final CustomerInquiryRepository customerInquiryRepository;
    private final FaqRepository faqRepository;

    public long getUserCount() {
        return memberRepository.countByRole("USER");
    }

    public long getTotalInquiryCount() {
        return customerInquiryRepository.count();
    }

    public long getWaitingInquiryCount() {
        return customerInquiryRepository.countByStatus("WAITING");
    }

    public long getFaqCount() {
        return faqRepository.count();
    }
}