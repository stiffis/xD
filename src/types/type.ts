export interface Credentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: number;
    email: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface FormRegister extends Credentials {
    username: string;
    repeatPassword: string;
}

export type PredictionObject = {
    timestamp?: number;
    frame?: number;
    sign?: string;
    label?: string;
    gloss?: string;
    text?: string;
    prediction?: string;
};

export type PredictionItem = string | PredictionObject;

export type ModelResponse = {
    file?: string;
    total_frames?: number;
    fps?: number;
    predictions?: PredictionItem[];
    text?: string;
    texto?: string;
    prediction?: string;
    predictedText?: string;
    predicted_text?: string;
    result?: string;
    output?: string;
    error?: string;
};

export type TranslationDirection = 'SIGN_TO_TEXT' | 'TEXT_TO_SIGN';

export type TranslationResponse = {
    requestId?: number;
    id?: number;
    status?: string;
    textOutput?: string | null;
    glossOutput?: string | null;
    signOutputRef?: string | null;
    confidence?: number | null;
    warning?: string | null;
    modelVersion?: string | null;
};
