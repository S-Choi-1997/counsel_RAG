// 구글 서비스 연동 API
import {api} from './api';

export const fetchGoogleData = async () => {
    const response = await api.get('/google/data');
    return response.data;
};