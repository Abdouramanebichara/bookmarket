import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalization } from '../context/LocalizationContext';
import { useDigitalBooks } from '../context/DigitalBooksContext';
import {
  FileText, Download, Eye, Calendar, FileType, BookOpen, Search
} from 'lucide-react';

export function DigitalLibraryPage() {
  const navigate = useNavigate();
  const { language } = useLocalization();
  const { digitalBooks, incrementDownload } = useDigitalBooks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = digitalBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileUrl = (book: { fileUrl?: string; productId: string }) => book.fileUrl || `/pdfs/${book.productId}.pdf`;

  const handleRead = (bookId: string, fileUrl: string) => {
    incrementDownload(bookId);
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (bookId: string, fileUrl: string, title: string) => {
    incrementDownload(bookId);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'livre'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} bytes`;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            {language === 'fr' ? 'Mes Livres Numériques' : 'My Digital Library'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'fr'
              ? 'Accédez à tous vos livres et documents numériques'
              : 'Access all your digital books and documents'}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un livre...' : 'Search a book...'}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{digitalBooks.length}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Livres numériques' : 'Digital Books'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {digitalBooks.reduce((sum, b) => sum + b.downloadCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Téléchargements' : 'Downloads'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {digitalBooks.reduce((sum, b) => sum + b.pageCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Pages au total' : 'Total Pages'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {searchQuery
                ? (language === 'fr' ? 'Aucun livre trouvé' : 'No books found')
                : (language === 'fr' ? "Vous n'avez pas encore de livres numériques" : "You don't have any digital books yet")}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/catalog')}
                className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {language === 'fr' ? 'Explorer le catalogue' : 'Explore Catalog'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const fileUrl = getFileUrl(book);
              return (
              <div
                key={book.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Cover Image */}
                <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {book.format}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-2">{book.title}</h3>
                  {book.author && (
                    <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileType className="w-3 h-3" />
                      {formatFileSize(book.fileSize)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {book.pageCount} {language === 'fr' ? 'pages' : 'pages'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {book.downloadCount} {language === 'fr' ? 'téléch.' : 'downloads'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {book.purchaseDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRead(book.id, fileUrl)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'fr' ? 'Lire' : 'Read'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDownload(book.id, fileUrl, book.title)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {book.lastDownloadDate && (
                    <p className="text-xs text-muted-foreground mt-3">
                      {language === 'fr' ? 'Dernier téléchargement:' : 'Last download:'}{' '}
                      {book.lastDownloadDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                    </p>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
