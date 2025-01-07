import { Button, Input } from "@/components/ui";
import { cn } from "@/lib";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useState } from "react";

export const ApiKeyInput = () => {
  const { setApiKey } = useSettingsStore();
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!inputKey.startsWith('sk-')) {
      setError('API Key must start with sk-');
      return;
    }

    setApiKey(inputKey);
    setError('');
  };

  return (
    <div className={cn('flex flex-col space-y-4 p-4')}>
      <Input
        type="password"
        label="OpenAI API Key"
        placeholder="sk-..."
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        error={error}
      />
      <Button onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
