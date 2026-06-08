import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useInquiryStore = create(
    persist(
        (set) => ({
            inquiries: [],

            addInquiry: (inquiry) => set((state) => ({
                inquiries: [
                    {
                        inquiryNo: String(Date.now()),
                        writerId: inquiry.writerId || 'user',
                        writerName: inquiry.writerName || '회원',
                        email: inquiry.email || '',
                        category: inquiry.category,
                        title: inquiry.title,
                        content: inquiry.content,
                        createdAt: new Date().toISOString().slice(0, 10),
                        status: '대기',
                        answer: '',
                        attachmentName: '',
                        attachmentUrl: '',
                    },
                    ...state.inquiries,
                ],
            })),

            answerInquiry: (updatedInquiry) => set((state) => ({
                inquiries: state.inquiries.map((inquiry) =>
                    inquiry.inquiryNo === updatedInquiry.inquiryNo
                        ? {
                            ...inquiry,
                            ...updatedInquiry,
                            status: '답변 완료',
                        }
                        : inquiry
                ),
            })),

            deleteInquiry: (inquiryNo) => set((state) => ({
                inquiries: state.inquiries.filter((inquiry) => inquiry.inquiryNo !== inquiryNo),
            })),
        }),
        {
            name: 'inquiry-storage',
        }
    )
);