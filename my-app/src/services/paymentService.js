import { api } from './api';

// 결제 정보 업데이트
export const updatePaymentInfo = async (clientId, paymentData) => {
  try {
    const response = await api.put(`/api/clients/${clientId}/payment`, paymentData);
    return response;
  } catch (error) {
    console.error('Error updating payment info:', error);
    throw error;
  }
};

// 결제 상태 변경
export const updatePaymentStatus = async (clientId, isPaid) => {
  try {
    const response = await api.put(`/api/clients/${clientId}/payment/status`, { isPaid });
    return response;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// 결제 내역 조회
export const getPaymentHistory = async (clientId) => {
  try {
    const response = await api.get(`/api/clients/${clientId}/payments`);
    return response;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};