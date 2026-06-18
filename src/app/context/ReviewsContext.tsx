import { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_REVIEWS } from '../data/mockData';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productTitle?: string;
  libraryId?: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  deleteReview: (reviewId: string) => void;
  getProductReviews: (productId: string) => Review[];
  getLibraryReviews: (libraryId: string) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const initialReviews: Review[] = MOCK_REVIEWS.map(r => ({
  id: r.id,
  userId: r.userId,
  userName: (r as any).userName || 'Client',
  productId: (r as any).productId || '',
  rating: r.rating,
  title: r.title,
  comment: r.comment,
  createdAt: r.createdAt,
}));

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const getProductReviews = (productId: string) =>
    reviews.filter(r => r.productId === productId);

  const getLibraryReviews = (libraryId: string) =>
    reviews.filter(r => r.libraryId === libraryId);

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, deleteReview, getProductReviews, getLibraryReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within ReviewsProvider');
  return context;
}
