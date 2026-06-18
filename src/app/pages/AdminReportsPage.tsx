import { useMemo, useState } from 'react';
import { FileText, Download, AlertCircle, TrendingUp, Users, ShoppingBag, Eye, Trash2, CheckCircle, RotateCcw } from 'lucide-react';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { useLocalization } from '../context/LocalizationContext';
import { MOCK_ORDERS } from '../data/mockData';
import { downloadTextPdf } from '../utils/pdf';

interface GeneratedReport {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'users' | 'inventory' | 'issues';
  period: string;
  generatedAt: string;
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
}

const GENERATED_REPORTS: GeneratedReport[] = [
  { id: 'rep-1', title: 'Rapport des Ventes - Janvier 2026', description: 'Statistiques complètes des ventes pour le mois de janvier', type: 'sales', period: 'Janvier 2026', generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), fileSize: '2.4 MB', status: 'ready' },
  { id: 'rep-2', title: 'Rapport Utilisateurs - Q1 2026', description: 'Analyse des utilisateurs actifs et nouvelles inscriptions', type: 'users', period: 'Q1 2026', generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), fileSize: '1.8 MB', status: 'ready' },
  { id: 'rep-3', title: 'Rapport Inventaire - Février 2026', description: 'État des stocks et mouvements de produits', type: 'inventory', period: 'Février 2026', generatedAt: new Date().toISOString(), fileSize: '1.1 MB', status: 'ready' },
  { id: 'rep-4', title: 'Rapport Problèmes Signalés - Décembre 2025', description: 'Liste des problèmes signalés et leur résolution', type: 'issues', period: 'Décembre 2025', generatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), fileSize: '856 KB', status: 'ready' },
];

export function AdminReportsPage() {
  const { formatPrice } = useLocalization();
  const {
    users,
    libraries,
    products,
    visibleProducts,
    productReports,
    markReportReviewing,
    dismissReport,
    removeReportedProduct,
    restoreProduct,
  } = useAdminPlatform();
  const [filter, setFilter] = useState<'all' | GeneratedReport['type']>('all');
  const [activeTab, setActiveTab] = useState<'reports' | 'signals'>('signals');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const revenue = MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0);
  const removedProducts = products.filter((product) => product.available === false);
  const selectedReport = productReports.find((report) => report.id === selectedReportId);
  const selectedProduct = selectedReport ? products.find((product) => product.id === selectedReport.productId) : null;
  const selectedLibrary = selectedReport ? libraries.find((library) => library.id === selectedReport.libraryId) : null;

  const generatedReports = useMemo(() => GENERATED_REPORTS, []);
  const filteredReports = filter === 'all' ? generatedReports : generatedReports.filter(r => r.type === filter);

  const handleDownloadGlobalReport = () => {
    downloadTextPdf('rapport-global-bookmarket.pdf', 'Rapport global BookMarket', [
      `Utilisateurs : ${users.length}`,
      `Librairies : ${libraries.length}`,
      `Produits visibles : ${visibleProducts.length}`,
      `Produits retirés : ${removedProducts.length}`,
      `Signalements : ${productReports.length}`,
      `Commandes : ${MOCK_ORDERS.length}`,
      `Revenu total : ${formatPrice(revenue)}`,
      `Date : ${new Date().toLocaleString('fr-FR')}`,
      '',
      'Ce rapport est généré localement pour la version frontend pseudo-fonctionnelle.',
    ]);
  };

  const handleDownload = (report: GeneratedReport) => {
    downloadTextPdf(`${report.title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.pdf`, report.title, [
      report.description,
      `Type : ${report.type}`,
      `Période : ${report.period}`,
      `Généré le : ${new Date(report.generatedAt).toLocaleDateString('fr-FR')}`,
      `Utilisateurs : ${users.length}`,
      `Librairies : ${libraries.length}`,
      `Produits visibles : ${visibleProducts.length}`,
      `Signalements : ${productReports.length}`,
      `Revenu total : ${formatPrice(revenue)}`,
    ]);
  };

  const getTypeIcon = (type: GeneratedReport['type']) => {
    switch (type) {
      case 'sales': return ShoppingBag;
      case 'users': return Users;
      case 'inventory': return TrendingUp;
      case 'issues': return AlertCircle;
    }
  };

  const getTypeColor = (type: GeneratedReport['type']) => {
    switch (type) {
      case 'sales': return 'bg-green-600';
      case 'users': return 'bg-blue-600';
      case 'inventory': return 'bg-purple-600';
      case 'issues': return 'bg-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
              <div>
                <h1 className="text-3xl font-bold">Rapports & Signalements</h1>
                <p className="text-sm text-muted-foreground">Téléchargez les rapports PDF et traitez les livres signalés.</p>
              </div>
            </div>
            <button onClick={handleDownloadGlobalReport} className="px-4 py-2 bg-purple-50 dark:bg-purple-950/20 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"><Download className="w-4 h-4" />Télécharger rapport global PDF</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slide-in-right">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Rapports</p><p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{generatedReports.length}</p></div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Signalements</p><p className="text-2xl font-bold text-red-600 dark:text-red-400">{productReports.length}</p></div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">À traiter</p><p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{productReports.filter(r => ['pending', 'reviewing'].includes(r.status)).length}</p></div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"><p className="text-sm text-muted-foreground mb-1">Livres retirés</p><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{removedProducts.length}</p></div>
        </div>

        <div className="flex gap-2 mb-6 animate-slide-in-left flex-wrap">
          <button onClick={() => setActiveTab('signals')} className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'signals' ? 'bg-red-50 dark:bg-red-950/20 text-white shadow-lg' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>Livres signalés</button>
          <button onClick={() => setActiveTab('reports')} className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'reports' ? 'bg-purple-50 dark:bg-purple-950/20 text-white shadow-lg' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>Rapports PDF</button>
        </div>

        {activeTab === 'signals' && (
          <div className="space-y-4 animate-fade-in">
            {productReports.map((report, index) => {
              const product = products.find((item) => item.id === report.productId);
              const library = libraries.find((item) => item.id === report.libraryId);
              return (
                <div key={report.id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-lg flex items-center justify-center flex-shrink-0"><AlertCircle className="w-6 h-6 text-white" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap"><h3 className="font-bold text-lg break-words">{report.productTitle}</h3><span className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : report.status === 'reviewing' ? 'bg-blue-100 text-blue-800' : report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{report.status === 'pending' ? 'En attente' : report.status === 'reviewing' ? 'En vérification' : report.status === 'resolved' ? 'Résolu' : 'Classé'}</span>{product?.available === false && <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Livre retiré</span>}</div>
                          <p className="text-sm text-muted-foreground mb-2"><strong>Raison :</strong> {report.reason}</p>
                          <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground"><span>Signalé par <strong>{report.reporterName}</strong></span><span>•</span><span>Librairie : <strong>{library?.name || 'Inconnue'}</strong></span><span>•</span><span>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button onClick={() => setSelectedReportId(report.id)} className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg flex items-center gap-2"><Eye className="w-4 h-4" />Voir</button>
                        {report.status === 'pending' && <button onClick={() => markReportReviewing(report.id)} className="px-3 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg">Vérifier</button>}
                        {product?.available !== false && <button onClick={() => removeReportedProduct(report.id)} className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-2"><Trash2 className="w-4 h-4" />Retirer</button>}
                        {product?.available === false && <button onClick={() => restoreProduct(report.productId)} className="px-3 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg flex items-center gap-2"><RotateCcw className="w-4 h-4" />Restaurer</button>}
                        {['pending', 'reviewing'].includes(report.status) && <button onClick={() => dismissReport(report.id)} className="px-3 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" />Classer</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {productReports.length === 0 && <div className="text-center py-16 bg-card rounded-xl border border-border"><AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Aucun livre signalé pour le moment.</p></div>}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['all', 'sales', 'users', 'inventory', 'issues'] as const).map((type) => <button key={type} onClick={() => setFilter(type)} className={`px-6 py-2.5 rounded-lg font-medium transition-all ${filter === type ? 'bg-purple-50 dark:bg-purple-950/20 text-white shadow-lg' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{type === 'all' ? 'Tous' : type === 'sales' ? 'Ventes' : type === 'users' ? 'Utilisateurs' : type === 'inventory' ? 'Inventaire' : 'Problèmes'}</button>)}
            </div>
            <div className="space-y-4 animate-fade-in">
              {filteredReports.map((report, index) => {
                const Icon = getTypeIcon(report.type);
                const colorClass = getTypeColor(report.type);
                return <div key={report.id} className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all" style={{ animationDelay: `${index * 0.05}s` }}><div className="p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-4 flex-1 min-w-0"><div className={`w-12 h-12 bg-primary ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}><Icon className="w-6 h-6 text-white" /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-2 flex-wrap"><h3 className="font-bold text-lg break-words">{report.title}</h3><span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Prêt</span></div><p className="text-sm text-muted-foreground mb-3">{report.description}</p><div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap"><span>Période: <strong>{report.period}</strong></span><span>•</span><span>Généré le {new Date(report.generatedAt).toLocaleDateString('fr-FR')}</span><span>•</span><span>Taille: <strong>{report.fileSize}</strong></span></div></div></div><button onClick={() => handleDownload(report)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 shrink-0"><Download className="w-4 h-4" />Télécharger</button></div></div></div>;
              })}
            </div>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedReportId(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Détails du signalement</h2>
            <div className="space-y-3 text-sm">
              <p><strong>Livre :</strong> {selectedReport.productTitle}</p>
              <p><strong>Librairie :</strong> {selectedLibrary?.name || 'Inconnue'}</p>
              <p><strong>Client :</strong> {selectedReport.reporterName}</p>
              <p><strong>Raison :</strong> {selectedReport.reason}</p>
              <p><strong>Description :</strong> {selectedReport.description}</p>
              <p><strong>Statut :</strong> {selectedReport.status}</p>
              <p><strong>Produit visible :</strong> {selectedProduct?.available === false ? 'Non' : 'Oui'}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {selectedProduct?.available !== false && <button onClick={() => removeReportedProduct(selectedReport.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Retirer le livre</button>}
              <button onClick={() => setSelectedReportId(null)} className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
