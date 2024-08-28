export function formatDateString(dateString: string | undefined) {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatDateTypeDefaultInput(date: Date) {
    return date.toISOString().substring(0, 10);
}

export function formatDateDefaultInput(date: string) {
    return new Date(date).toISOString().substring(0, 10);
}

export function formatDate(date: Date) {
    return new Date(date).toLocaleDateString();
}

export function getTimeElapsed(startDate: any): string {
    if (typeof startDate === 'string') startDate = new Date(startDate);

    const currentDate = Date.now(); // Retorna la fecha actual en milisegundos
    const elapsedMs = currentDate - startDate.getTime();
    const seconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `hace ${days}d ${hours % 24}h `;
    } else if (hours > 0) {
        return `hace ${hours}h ${minutes % 60}m `;
    } else if (minutes > 0) {
        return `hace ${minutes}m ${seconds % 60}s `;
    } else {
        return `hace ${seconds}s `;
    }
}

// Convert a date string to a Date object
export function convertToDate(dateString: string): Date {
    return new Date(dateString);
}

export function formatDateForTPV(dateString: string) {
    // DataString format is 2024-08-28 00:00:00+00
    // NEW Format YYYYMMDD
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}${month < 10 ? '0' + month : month}${
        day < 10 ? '0' + day : day
    }`;
}
