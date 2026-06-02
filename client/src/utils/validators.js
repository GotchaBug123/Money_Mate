/**
 * 비밀번호 유효성 검사 (영문, 숫자, 특수문자 포함 8자 이상)
 */
export const isValidPassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{8,}$/;
    return regex.test(password);
};

/**
 * 이메일 형식 검사
 */
export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

/**
 * 휴대폰 번호 하이픈 자동 추가 (01012345678 -> 010-1234-5678)
 * onChange 이벤트 등에서 value를 포맷팅할 때 씁니다.
 */
export const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};