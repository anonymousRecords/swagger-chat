'use client';

import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSettingsStore } from '@/store/settings';

import SwaggerWrapper from './swagger-wrapper';

interface ISettingsForm {
  apiKey: string;
  swaggerUrl: string;
}

export default function SettingsFormNew({ className = '' }: { className?: string }) {
  const { swaggerUrl, apiKey, setApiKey, setSwaggerUrl } = useSettingsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ISettingsForm>({
    mode: 'onChange',
    defaultValues: {
      apiKey: apiKey || '',
      swaggerUrl: swaggerUrl || '',
    },
  });

  const validateApiKey = async (value: string) => {
    if (!value.startsWith('sk-')) {
      return 'Invalid API Key format';
    }
    return true;
  };

  const validateSwaggerUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) return 'Invalid Swagger URL';

      const data = await response.json();
      if (!data.swagger && !data.openapi) {
        return 'Invalid Swagger/OpenAPI document';
      }
      return true;
    } catch (error) {
      console.error('Swagger URL validation error:', error);
      return 'Failed to validate Swagger URL';
    }
  };

  const onSubmit = async (data: ISettingsForm) => {
    setIsSubmitting(true);
    try {
      setApiKey(data.apiKey);
      setSwaggerUrl(data.swaggerUrl);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Settings</h2>

      <div className="space-y-2">
        <label htmlFor="apiKey" className="block text-sm font-bold text-white">
          OpenAI API Key
        </label>
        <input
          id="apiKey"
          type="password"
          {...register('apiKey', {
            required: 'API Key is required',
            validate: validateApiKey,
          })}
          placeholder="sk-..."
          className={`w-full rounded-lg border ${
            errors.apiKey ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-300'
          } px-4 py-2 focus:outline-4 focus:outline-[#97E865] focus:outline-offset-0 focus:border-none`}
        />
        {errors.apiKey && <p className="text-sm text-red-500">{errors.apiKey.message}</p>}
        <p className="text-sm text-gray-500">
          The API key is used only in the browser session and is not stored on the server.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="swaggerUrl" className="block text-sm font-bold text-white">
          Swagger URL
        </label>
        <input
          id="swaggerUrl"
          type="url"
          {...register('swaggerUrl', {
            required: 'Swagger URL is required',
            validate: validateSwaggerUrl,
          })}
          placeholder="https://api.example.com/swagger.json"
          className={`w-full rounded-lg border ${
            errors.apiKey ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-300'
          } px-4 py-2 focus:outline-4 focus:outline-[#97E865] focus:outline-offset-0 focus:border-none`}
        />
        {errors.swaggerUrl && <p className="text-sm text-red-500">{errors.swaggerUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="font-bold w-full px-4 py-2 text-white bg-[#97E865] rounded-lg hover:bg-[#7bc750] disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Setting up...' : 'Set Up'}
      </button>
    </form>
  );

  return (
    <div className={`h-full border-gray-200 ${className}`}>
      {!swaggerUrl ? (
        <FormContent />
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-end p-2">
            <button
              onClick={() => setSwaggerUrl('')}
              className="flex gap-1 p-1 rounded text-white hover:text-[#97E865]"
            >
              <ArrowLongLeftIcon className="w-6 h-6 " />
              <p className="">back to settings</p>
            </button>
          </div>
          <SwaggerWrapper url={swaggerUrl} />
        </div>
      )}
    </div>
  );
}
