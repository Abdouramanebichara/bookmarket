import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface ClientProductRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  title: string;
  author?: string;
  category?: string;
  description?: string;
  budget?: number;
  city?: string;
  urgency: 'normal' | 'urgent';
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface LibraryProductRequestResponse {
  id: string;
  requestId: string;
  libraryId: string;
  libraryName: string;
  message: string;
  proposedPrice?: number;
  availability: 'available' | 'can_order' | 'unavailable';
  contactPhone?: string;
  createdAt: string;
}

interface ProductRequestsContextValue {
  requests: ClientProductRequest[];
  responses: LibraryProductRequestResponse[];
  createRequest: (input: Omit<ClientProductRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  respondToRequest: (input: Omit<LibraryProductRequestResponse, 'id' | 'createdAt'>) => void;
  closeRequest: (requestId: string) => void;
  getClientRequests: (clientId?: string) => ClientProductRequest[];
  getRequestResponses: (requestId: string) => LibraryProductRequestResponse[];
  getOpenRequestsForLibrary: () => ClientProductRequest[];
}

const STORAGE = {
  requests: 'bookmarket_client_product_requests',
  responses: 'bookmarket_library_product_request_responses',
};

const seedRequests: ClientProductRequest[] = [
  {
    id: 'req-book-1',
    clientId: 'client-test',
    clientName: 'Client test',
    clientEmail: 'client@bookstore.cm',
    title: 'Introduction aux Réseaux Locaux',
    author: 'Prof. Thomas Djotio Ndié',
    category: 'Livres',
    description: 'Recherche du support de cours en réseau local.',
    budget: 10000,
    city: 'Yaoundé',
    urgency: 'normal',
    status: 'open',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const seedResponses: LibraryProductRequestResponse[] = [];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const ProductRequestsContext = createContext<ProductRequestsContextValue | undefined>(undefined);

export function ProductRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ClientProductRequest[]>(() => readJSON(STORAGE.requests, seedRequests));
  const [responses, setResponses] = useState<LibraryProductRequestResponse[]>(() => readJSON(STORAGE.responses, seedResponses));

  useEffect(() => writeJSON(STORAGE.requests, requests), [requests]);
  useEffect(() => writeJSON(STORAGE.responses, responses), [responses]);

  useEffect(() => {
    const refresh = () => {
      setRequests(readJSON(STORAGE.requests, seedRequests));
      setResponses(readJSON(STORAGE.responses, seedResponses));
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('bookmarket_product_requests_updated', refresh as EventListener);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('bookmarket_product_requests_updated', refresh as EventListener);
    };
  }, []);

  const createRequest: ProductRequestsContextValue['createRequest'] = (input) => {
    const now = new Date().toISOString();
    const request: ClientProductRequest = {
      ...input,
      id: `request-${Date.now()}`,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };
    setRequests((current) => {
      const next = [request, ...current];
      writeJSON(STORAGE.requests, next);
      window.dispatchEvent(new CustomEvent('bookmarket_product_requests_updated'));
      return next;
    });
    toast.success('Demande envoyée à toutes les librairies');
  };

  const respondToRequest: ProductRequestsContextValue['respondToRequest'] = (input) => {
    const response: LibraryProductRequestResponse = {
      ...input,
      id: `response-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setResponses((current) => {
      const next = [response, ...current];
      writeJSON(STORAGE.responses, next);
      window.dispatchEvent(new CustomEvent('bookmarket_product_requests_updated'));
      return next;
    });
    setRequests((current) => {
      const next = current.map((request) => request.id === input.requestId ? { ...request, status: 'answered' as const, updatedAt: new Date().toISOString() } : request);
      writeJSON(STORAGE.requests, next);
      return next;
    });
    toast.success('Réponse envoyée au client');
  };

  const closeRequest = (requestId: string) => {
    setRequests((current) => current.map((request) => request.id === requestId ? { ...request, status: 'closed', updatedAt: new Date().toISOString() } : request));
    toast.success('Demande clôturée');
  };

  const value = useMemo<ProductRequestsContextValue>(() => ({
    requests,
    responses,
    createRequest,
    respondToRequest,
    closeRequest,
    getClientRequests: (clientId?: string) => clientId ? requests.filter((request) => request.clientId === clientId) : requests,
    getRequestResponses: (requestId: string) => responses.filter((response) => response.requestId === requestId),
    getOpenRequestsForLibrary: () => requests.filter((request) => request.status !== 'closed'),
  }), [requests, responses]);

  return <ProductRequestsContext.Provider value={value}>{children}</ProductRequestsContext.Provider>;
}

export function useProductRequests() {
  const context = useContext(ProductRequestsContext);
  if (!context) throw new Error('useProductRequests must be used within ProductRequestsProvider');
  return context;
}
