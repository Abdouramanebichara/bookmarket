import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { CheckCircle, Clock, Download, Eye, FileText, Mail, MapPin, Navigation, Phone, Shield, Store, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UploadedDocument } from '../types';

function formatFileSize(size?: number) {
  if (!size) return 'Taille inconnue';
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}

function openDocument(document: UploadedDocument) {
  const opened = window.open(document.dataUrl, '_blank', 'noopener,noreferrer');
  if (!opened) {
    toast.error('Le navigateur a bloqué l’ouverture du document. Autorisez les pop-ups ou téléchargez le fichier.');
  }
}

function downloadDocument(document: UploadedDocument) {
  const link = window.document.createElement('a');
  link.href = document.dataUrl;
  link.download = document.fileName || `${document.label}.pdf`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
}

export function AdminValidationsPage() {
  const { libraryRequests, approveLibraryRequest, rejectLibraryRequest } = useAuth();
  const { addLibraryFromRequest } = useAdminPlatform();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = libraryRequests.filter((request) => statusFilter === 'all' || request.status === statusFilter);
  const pending = libraryRequests.filter((request) => request.status === 'pending').length;
  const approved = libraryRequests.filter((request) => request.status === 'approved').length;
  const rejected = libraryRequests.filter((request) => request.status === 'rejected').length;

  const handleApprove = (requestId: string) => {
    const request = libraryRequests.find((item) => item.id === requestId);
    if (!request) return;
    approveLibraryRequest(requestId);
    addLibraryFromRequest(request);
    toast.success('Création de librairie acceptée');
  };

  const handleReject = (requestId: string) => {
    rejectLibraryRequest(requestId);
    toast.success('Demande de création refusée');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Validation des Librairies</h1>
              <p className="text-sm text-muted-foreground">Contrôler les informations légales, les coordonnées GPS et les documents administratifs avant activation.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"><p className="text-sm text-muted-foreground">Total demandes</p><p className="text-2xl font-bold text-blue-600">{libraryRequests.length}</p></div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"><p className="text-sm text-muted-foreground">En attente</p><p className="text-2xl font-bold text-yellow-600">{pending}</p></div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"><p className="text-sm text-muted-foreground">Acceptées</p><p className="text-2xl font-bold text-green-600">{approved}</p></div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"><p className="text-sm text-muted-foreground">Refusées</p><p className="text-2xl font-bold text-red-600">{rejected}</p></div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === status ? 'bg-purple-500 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                {status === 'all' ? 'Toutes' : status === 'pending' ? 'En attente' : status === 'approved' ? 'Acceptées' : 'Refusées'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filteredRequests.map((request) => {
            const documents = request.documents || [];
            return (
              <div key={request.id} className="bg-card rounded-xl border border-border p-5 sm:p-6 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center shrink-0"><Store className="w-7 h-7 text-orange-600" /></div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-xl font-bold break-words">{request.libraryName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Acceptée' : 'Refusée'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Responsable : <strong>{request.ownerName}</strong></p>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /><span className="break-all">{request.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />{request.phone}</div>
                        <div className="flex items-center gap-2 sm:col-span-2"><MapPin className="w-4 h-4 shrink-0" /><span>{request.location}, {request.city || 'Yaoundé'}, {request.country || 'Cameroun'}</span></div>
                        <div className="flex items-center gap-2 sm:col-span-2"><Navigation className="w-4 h-4 shrink-0" />GPS : {request.latitude ?? '—'}, {request.longitude ?? '—'}</div>
                        <div className="flex items-center gap-2 sm:col-span-2"><Clock className="w-4 h-4 shrink-0" />Soumise le {new Date(request.submittedAt).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button onClick={() => handleApprove(request.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Accepter</button>
                      <button onClick={() => handleReject(request.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"><XCircle className="w-4 h-4" />Refuser</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                  <div className="bg-muted/30 rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">RCCM</p><p className="font-semibold break-words">{request.rccmNumber || 'Non renseigné'}</p></div>
                  <div className="bg-muted/30 rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">NIU / Contribuable</p><p className="font-semibold break-words">{request.taxpayerNumber || 'Non renseigné'}</p></div>
                  <div className="bg-muted/30 rounded-xl p-4"><p className="text-xs text-muted-foreground mb-1">Statut juridique</p><p className="font-semibold break-words">{request.legalStatus || 'Non renseigné'}</p></div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-5 h-5" />Documents transmis</h4>
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {documents.map((document) => (
                        <div key={document.id} className="border border-border rounded-xl p-4 bg-background">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <p className="font-medium text-sm break-words">{document.label}</p>
                              <p className="text-xs text-muted-foreground break-all">{document.fileName}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(document.size)}</p>
                            </div>
                            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => openDocument(document)} className="flex-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm flex items-center justify-center gap-1"><Eye className="w-4 h-4" />Voir</button>
                            <button type="button" onClick={() => downloadDocument(document)} className="flex-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm flex items-center justify-center gap-1"><Download className="w-4 h-4" />Télécharger</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">Aucun document joint à cette demande.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune demande de création de librairie trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
