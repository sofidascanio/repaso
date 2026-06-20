import { Injectable } from '@nestjs/common';
import { ReviewResult } from '@prisma/client';

export interface SM2Input {
    easeFactor: number;
    interval: number;
    repetitions: number;
    result: ReviewResult;
}

export interface SM2Output {
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: Date;
}

@Injectable()
export class SM2Service {
    calculate(input: SM2Input): SM2Output {
        let { easeFactor, interval, repetitions } = input;
        const { result } = input;

        // calidad de respuesta: mapeo de ReviewResult a valor numerico (0-5)
        const quality = this.resultToQuality(result);

        if (quality < 3) {
            // respuesta incorrecta o muy dificil: reinicia
            repetitions = 0;
            interval = 1;
        } else {
            // respuesta correcta
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        }

        // ajusta ease factor segun calidad
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        easeFactor = Math.max(1.3, easeFactor); // min 1.3

        // calcula proxima fecha de repaso
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);
        nextReviewDate.setHours(0, 0, 0, 0);

        return {
            easeFactor: Math.round(easeFactor * 1000) / 1000,
            interval,
            repetitions,
            nextReviewDate,
        };
    }

    private resultToQuality(result: ReviewResult): number {
        switch (result) {
            case ReviewResult.AGAIN: return 0;
            case ReviewResult.HARD: return 2;
            case ReviewResult.GOOD: return 4;
            case ReviewResult.EASY: return 5;
        }
    }
}