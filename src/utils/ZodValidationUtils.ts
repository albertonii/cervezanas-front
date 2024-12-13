import { z } from 'zod';

export const validateDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
        return 'La fecha de fin debe ser posterior o igual a la fecha de inicio';
    }
    return true;
};
