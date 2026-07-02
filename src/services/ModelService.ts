import type { ModelResponse } from '../types/type';

export const MODEL_API_URL = 'http://127.0.0.1:8000/predict_video';

async function readJsonOrEmpty(response: Response) {
    const text = await response.text();
    if (!text.trim()) return {};
    try {
        return JSON.parse(text);
    } catch {
        return { error: text };
    }
}

function formatHttpError(response: Response, body: Record<string, unknown>) {
    const detail =
        (body.message as string | undefined) ??
        (body.error as string | undefined) ??
        (body.warning as string | undefined) ??
        response.statusText ??
        'Respuesta sin detalle';
    return `HTTP ${response.status}: ${detail}`;
}

export async function sendVideoToModel(videoUri: string): Promise<ModelResponse> {
    const formData = new FormData();
    formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'traduccion.mp4',
    } as unknown as Blob);

    const response = await fetch(MODEL_API_URL, {
        method: 'POST',
        body: formData,
    });

    const body = (await readJsonOrEmpty(response)) as ModelResponse;

    if (!response.ok || body.error) {
        throw new Error(body.error || formatHttpError(response, body as Record<string, unknown>));
    }

    return body;
}

function getPredictionValue(item: unknown) {
    if (typeof item === 'string') {
        return item;
    }
    if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        return obj.sign ?? obj.label ?? obj.gloss ?? obj.text ?? obj.prediction ?? '';
    }
    return '';
}

function getRawPredictionText(predictions: unknown[]) {
    return predictions.map(getPredictionValue).join(' ');
}

export async function sendVideoToPython(videoUri: string): Promise<string> {
    const body = await sendVideoToModel(videoUri);
    const text = getRawPredictionText(body.predictions ?? []);

    if (!text) {
        throw new Error('El modelo no devolvio texto predicho.');
    }

    return text;
}
