import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import type { InitProgressReport, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { useState, useEffect, useCallback } from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const useWebLLM = (model: string = 'Llama-3.2-1B-Instruct-q4f16_1-MLC') => {
  const [engine, setEngine] = useState<MLCEngine | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initEngine = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const engineInstance = await CreateMLCEngine(model, {
          initProgressCallback: (report: InitProgressReport) => {
            setProgress(report.progress);
          }
        });
        
        setEngine(engineInstance);
      } catch (err) {
        console.error('Ошибка инициализации модели:', err);
        setError('Не удалось загрузить модель. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    initEngine();

    return () => {
      if (engine) {
        // Очистка ресурсов при размонтировании
        engine.unload();
      }
    };
  }, [model]);

  const generateResponse = useCallback(async (
    messages: ChatCompletionMessageParam[],
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> => {
    if (!engine) {
      throw new Error('Модель не загружена');
    }

    try {
      const response = await engine.chat.completions.create({
        messages,
        temperature: options?.temperature || 0.1,
        max_tokens: options?.maxTokens || 500,
        stream: false
      });

      return response.choices[0].message.content || '';
    } catch (err) {
      console.error('Ошибка генерации ответа:', err);
      throw err;
    }
  }, [engine]);

  return { 
    engine, 
    progress, 
    error, 
    isLoading,
    generateResponse
  };
};

export default useWebLLM;