import api from '../api/axios';
import type { TranslationDirection, TranslationResponse } from '../types/type';

const POLL_DELAY_MS = 1000;
const MAX_POLL_ATTEMPTS = 20;

export async function createTranslation(direction: TranslationDirection, sourceText: string) {
    const response = await api.post<TranslationResponse>('/translations', {
        direction,
        sourceText,
    });

    const created = response.data;
    const requestId = String(created.requestId ?? created.id ?? '');

    if (!requestId) {
        throw new Error('El backend no devolvio requestId.');
    }

    return requestId;
}

async function getTranslation(requestId: string) {
    const response = await api.get<TranslationResponse>(`/translations/${requestId}`);
    return response.data;
}

export async function pollTranslation(requestId: string) {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, POLL_DELAY_MS));
        const data = await getTranslation(requestId);

        if (data.status === 'COMPLETED' || data.textOutput) {
            return data;
        }

        if (data.status === 'FAILED') {
            throw new Error(data.warning || 'La traduccion fallo en el backend.');
        }
    }

    throw new Error('El backend aun no termina la traduccion.');
}
