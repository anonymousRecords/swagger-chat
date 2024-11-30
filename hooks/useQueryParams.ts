import { useEffect, useState, useCallback } from 'react';

type QueryParamTypeMap = {
  string: string;
  boolean: boolean;
  number: number;
};

type QueryParamType = keyof QueryParamTypeMap;

type QueryParamConfig = {
  [key in string]: QueryParamType;
};

type QueryParamResult<T extends QueryParamConfig> = {
  [key in keyof T]?: QueryParamTypeMap[T[key]];
};

const v = {
  parse(value: string | null, type: QueryParamType) {
    if (value === null) return undefined;
    switch (type) {
      case 'string':
        return value;
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
    }
  },
  serialize(value: any, type: QueryParamType) {
    if (value === undefined || value === null) return undefined;
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        return String(value);
      case 'boolean':
        return value ? 'true' : 'false';
    }
  },
};

export function useQueryParams<T extends QueryParamConfig>(
  config: T,
  deps: any[] = []
): [QueryParamResult<T>, (newParams: Partial<QueryParamResult<T>>) => void] {
  const getParams = useCallback(() => {
    const searchParams = getSearchParams();
    const newParams = {} as QueryParamResult<T>;
    for (const key in config) {
      const type = config[key];
      const value = v.parse(searchParams.get(key), type);
      newParams[key] = value as any;
    }
    return newParams;
  }, deps);

  const [params, _setParams] = useState<QueryParamResult<T>>(() => {
    return getParams();
  });

  const setParams = useCallback((newParams: QueryParamResult<T>) => {
    _setParams(params => {
      return isEqual(params, newParams) ? params : { ...params, ...newParams };
    });
  }, []);

  const syncParams = useCallback((newParams: Partial<QueryParamResult<T>>) => {
    if (typeof window === 'undefined') return;

    const searchParams = getSearchParams();
    for (const key in newParams) {
      const type = config[key];
      const value = v.serialize(newParams[key], type);
      if (value != null) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    }
    const newUrl = window.location.pathname + '?' + searchParams.toString() + window.location.hash;

    pushState(newUrl);
  }, deps);

  const pathname = usePathname();
  useEffect(() => {
    setParams(getParams());
  }, [pathname]);

  useEffect(() => {
    const handleStateChange = () => {
      const newParams = getParams();
      setParams(newParams);
    };

    window.addEventListener('popstate', handleStateChange);
    pushStateEventManager.addEventListener(handleStateChange);

    return () => {
      window.removeEventListener('popstate', handleStateChange);
      pushStateEventManager.removeEventListener(handleStateChange);
    };
  }, deps);

  return [params, syncParams];
}

const pushStateEventManager = (function () {
  let subscribers: Function[] = [];

  return {
    notify: () => {
      subscribers.forEach(callback => {
        callback();
      });
    },
    addEventListener: (callback: Function) => {
      subscribers.push(callback);
    },
    removeEventListener: (callback: Function) => {
      subscribers = subscribers.filter(v => callback !== v);
    },
  };
})();

export function pushState(newUrl: string) {
  window.history.pushState({}, '', newUrl);
  pushStateEventManager.notify();
}

import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { usePathname } from 'next/navigation';

function getSearchParams() {
  return new URLSearchParams(getSearchString());
}

function getSearchString(): string {
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) {
    const store = staticGenerationAsyncStorage.getStore();
    const pathname = store?.urlPathname;
    if (pathname == null) return '';
    const q = pathname.match(RegExp(/[?w+]/))?.index;
    if (q == null) return '';

    return pathname.substring(q);
  }

  return window.location.search;
}

function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object' && a !== null && b !== null) {
    const aEntries = Object.entries(a);
    const bEntries = Object.entries(b);

    if (aEntries.length !== bEntries.length) return false;

    return aEntries.every(([key, value]) => isEqual(value, b[key as any]));
  }

  return false;
}
