package com.gotchabug.moneymate.customer.service;

import com.gotchabug.moneymate.customer.dto.CustomerInquiryResponse;
import com.gotchabug.moneymate.customer.entity.CustomerInquiry;
import com.gotchabug.moneymate.customer.entity.Faq;
import com.gotchabug.moneymate.member.entity.Member;
import com.gotchabug.moneymate.customer.repository.CustomerInquiryRepository;
import com.gotchabug.moneymate.customer.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerCenterService {

    private final FaqRepository faqRepository;
    private final CustomerInquiryRepository customerInquiryRepository;

    public List<Faq> getTopFaqs() {
        return faqRepository.findTop10ByActiveYnOrderByViewCountDesc("Y");
    }

    public List<Faq> getFaqsByCategory(String category) {
        return faqRepository.findByCategoryAndActiveYnOrderByViewCountDesc(category, "Y");
    }

    public List<String> getCategories() {
        return List.of(
                "투자",
                "수익률",
                "포트폴리오",
                "계정",
                "데이터",
                "문의"
        );
    }

    public List<CustomerInquiryResponse> getMyInquiries(Long memberId) {
        return customerInquiryRepository.findByMember_MemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(CustomerInquiryResponse::from)
                .toList();
    }

    @Transactional
    public void createInquiry(Member member, String category, String title, String content) {
        CustomerInquiry inquiry = new CustomerInquiry(
                member,
                category,
                title,
                content
        );

        customerInquiryRepository.save(inquiry);
    }
}
