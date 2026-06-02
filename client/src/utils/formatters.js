/**
 * 숫자를 한국 돈(원) 형식으로 변환 (예: 1500000 -> "1,500,000")
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0';
    return new Intl.NumberFormat('ko-KR').format(amount);
};

/**
 * 큰 단위를 한글로 축약 (예: 150000000 -> "1억 5,000만")
 * 마이 자산, 대시보드 등에서 좁은 영역에 큰 금액을 표기할 때 유용합니다.
 */
export const formatKoreanCurrency = (number) => {
    if (!number) return '0원';

    const units = ['', '만', '억', '조'];
    let result = '';
    let temp = Math.floor(number);
    let unitIndex = 0;

    while (temp > 0) {
        const mod = temp % 10000;
        if (mod > 0) {
            result = `${new Intl.NumberFormat('ko-KR').format(mod)}${units[unitIndex]} ` + result;
        }
        temp = Math.floor(temp / 10000);
        unitIndex++;
    }

    return result.trim() + '원';
};

/**
 * 등락률 퍼센트 포맷 (예: 2.5 -> "+2.50%", -1.2 -> "-1.20%")
 */
export const formatPercent = (rate) => {
    if (!rate && rate !== 0) return '0.00%';
    const sign = rate > 0 ? '+' : '';
    return `${sign}${Number(rate).toFixed(2)}%`;
};

/**
 * 날짜 포맷팅 (YYYY. MM. DD)
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}. ${mm}. ${dd}`;
};