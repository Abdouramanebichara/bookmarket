export interface DigitalVersion {
  id: string;
  productId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number; // in bytes
  pageCount: number;
  price: number;
  format: 'pdf' | 'epub' | 'mobi';
  downloadLimit?: number;
  accessDuration?: number; // in days, undefined means lifetime
  preview?: {
    pages: number;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchasedDigitalProduct {
  id: string;
  userId: string;
  productId: string;
  digitalVersionId: string;
  purchaseDate: Date;
  downloadCount: number;
  lastDownloadDate?: Date;
  expiryDate?: Date;
  product: {
    id: string;
    title: string;
    author?: string;
    coverImage: string;
  };
  digitalFile: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    pageCount: number;
    format: string;
  };
}
