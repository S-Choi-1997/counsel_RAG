// 포맷팅 관련 유틸리티 함수
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
};

export const formatPercentage = (value) => {
    return `${value}%`;
};