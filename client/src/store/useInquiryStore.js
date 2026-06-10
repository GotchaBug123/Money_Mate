import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const extractInquiries = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.inquiries)) {
        return payload.inquiries;
    }

    if (Array.isArray(payload?.data?.inquiries)) {
        return payload.data.inquiries;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
};

export const useInquiryStore = create(
    persist(
        (set) => ({
            inquiries: [],

            setInquiries: (payload) => set({
                inquiries: extractInquiries(payload),
            }),

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
                        createdAt: new Date().toISOString(),
                        status: 'WAITING',
                        answer: '',
                        attachmentName: '',
                        attachmentUrl: '',
                    },
                    ...state.inquiries,
                ],
            })),

            answerInquiry: (updatedInquiry) => set((state) => ({
                inquiries: state.inquiries.map((inquiry) =>
                    (inquiry.inquiryNo ?? inquiry.inquiryId) === (updatedInquiry.inquiryNo ?? updatedInquiry.inquiryId)
                        ? {
                            ...inquiry,
                            ...updatedInquiry,
                            status: 'ANSWERED',
                        }
                        : inquiry
                ),
            })),

            deleteInquiry: (inquiryNo) => set((state) => ({
                inquiries: state.inquiries.filter((inquiry) =>
                    (inquiry.inquiryNo ?? inquiry.inquiryId) !== inquiryNo
                ),
            })),
        }),
        {
            name: 'inquiry-storage',
            version: 2,
            migrate: () => ({inquiries: []}),
        }
    )
);
