import { createContext, useContext, useState, ReactNode } from 'react';

export interface DigitalBook {
  id: string;
  productId: string;
  title: string;
  author?: string;
  coverImage?: string;
  purchaseDate: Date;
  fileSize: number;
  pageCount: number;
  downloadCount: number;
  lastDownloadDate?: Date;
  format: string;
  fileUrl?: string;
}

interface DigitalBooksContextType {
  digitalBooks: DigitalBook[];
  addDigitalBook: (book: Omit<DigitalBook, 'id' | 'downloadCount' | 'purchaseDate'>) => void;
  incrementDownload: (bookId: string) => void;
}

const DIGITAL_BOOKS_STORAGE_KEY = 'bookmarket_digital_books';

const DigitalBooksContext = createContext<DigitalBooksContextType | undefined>(undefined);

function reviveDigitalBooks(value: string | null): DigitalBook[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as Array<Omit<DigitalBook, 'purchaseDate' | 'lastDownloadDate'> & { purchaseDate: string; lastDownloadDate?: string }>;
    return parsed.map((book) => ({
      ...book,
      purchaseDate: new Date(book.purchaseDate),
      lastDownloadDate: book.lastDownloadDate ? new Date(book.lastDownloadDate) : undefined,
    }));
  } catch {
    return [];
  }
}

export function DigitalBooksProvider({ children }: { children: ReactNode }) {
  const [digitalBooks, setDigitalBooks] = useState<DigitalBook[]>(() => reviveDigitalBooks(localStorage.getItem(DIGITAL_BOOKS_STORAGE_KEY)));

  const persist = (books: DigitalBook[]) => {
    localStorage.setItem(DIGITAL_BOOKS_STORAGE_KEY, JSON.stringify(books));
    return books;
  };

  const addDigitalBook = (bookData: Omit<DigitalBook, 'id' | 'downloadCount' | 'purchaseDate'>) => {
    setDigitalBooks(prev => {
      if (prev.some(b => b.productId === bookData.productId)) return prev;
      const newBook: DigitalBook = {
        ...bookData,
        id: `digital-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        downloadCount: 0,
        purchaseDate: new Date(),
      };
      return persist([newBook, ...prev]);
    });
  };

  const incrementDownload = (bookId: string) => {
    setDigitalBooks(prev => persist(
      prev.map(b =>
        b.id === bookId
          ? { ...b, downloadCount: b.downloadCount + 1, lastDownloadDate: new Date() }
          : b
      )
    ));
  };

  return (
    <DigitalBooksContext.Provider value={{ digitalBooks, addDigitalBook, incrementDownload }}>
      {children}
    </DigitalBooksContext.Provider>
  );
}

export function useDigitalBooks() {
  const context = useContext(DigitalBooksContext);
  if (!context) throw new Error('useDigitalBooks must be used within DigitalBooksProvider');
  return context;
}
