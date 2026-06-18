import { useState } from 'react';
import { Search, MessageSquare, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useProductRequests } from '../context/ProductRequestsContext';

export function LibrairieProductRequestsPage() {
  const { user } = useAuth();
  const { formatPrice } = useLocalization();
  const { getOpenRequestsForLibrary, getRequestResponses, respondToRequest } = useProductRequests();
  const [responseDrafts, setResponseDrafts] = useState<Record<string, { message: string; proposedPrice: string; availability: 'available' | 'can_order' | 'unavailable' }>>({});

  const requests = getOpenRequestsForLibrary();

  const getDraft = (requestId: string) => responseDrafts[requestId] || { message: '', proposedPrice: '', availability: 'available' as const };
  const updateDraft = (requestId: string, patch: Partial<ReturnType<typeof getDraft>>) => {
    setResponseDrafts((current) => ({ ...current, [requestId]: { ...getDraft(requestId), ...patch } }));
  };

  const submitResponse = (requestId: string) => {
    const draft = getDraft(requestId);
    if (!user || !draft.message.trim()) return;
    respondToRequest({
      requestId,
      libraryId: user.id,
      libraryName: user.name,
      message: draft.message.trim(),
      proposedPrice: draft.proposedPrice ? Number(draft.proposedPrice) : undefined,
      availability: draft.availability,
      contactPhone: user.phone,
    });
    setResponseDrafts((current) => ({ ...current, [requestId]: { message: '', proposedPrice: '', availability: 'available' } }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><Search className="w-6 h-6 text-orange-600" /></div>
          <div>
            <h1 className="text-3xl font-bold">Demandes clients</h1>
            <p className="text-sm text-muted-foreground">Les demandes de produits introuvables sont envoyées à toutes les librairies. Vous pouvez y répondre si vous avez le produit ou si vous pouvez le commander.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-sm text-muted-foreground">Demandes reçues</p><p className="text-2xl font-bold text-blue-600">{requests.length}</p></div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4"><p className="text-sm text-muted-foreground">Avec réponses</p><p className="text-2xl font-bold text-green-600">{requests.filter(r => getRequestResponses(r.id).length > 0).length}</p></div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"><p className="text-sm text-muted-foreground">En attente</p><p className="text-2xl font-bold text-yellow-600">{requests.filter(r => getRequestResponses(r.id).length === 0).length}</p></div>
        </div>

        <div className="space-y-5">
          {requests.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">Aucune demande client pour le moment.</div>
          ) : requests.map((request) => {
            const responses = getRequestResponses(request.id);
            const alreadyResponded = responses.some((response) => response.libraryId === user?.id);
            const draft = getDraft(request.id);
            return (
              <div key={request.id} className="bg-card border border-border rounded-xl p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{request.title}</h3>
                    <p className="text-sm text-muted-foreground">Demandé par {request.clientName} · {new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm text-muted-foreground">{request.author || 'Auteur non précisé'} · {request.category || 'Catégorie non précisée'} · {request.city || 'Ville non précisée'}</p>
                    {request.budget && <p className="text-sm text-muted-foreground">Budget indicatif : {formatPrice(request.budget)}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${request.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{request.urgency === 'urgent' ? 'Urgent' : 'Normal'}</span>
                </div>

                {request.description && <p className="text-sm bg-muted/30 rounded-lg p-3 mb-5">{request.description}</p>}

                {alreadyResponded ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg p-3"><CheckCircle className="w-4 h-4" />Votre librairie a déjà répondu à cette demande.</div>
                ) : (
                  <div className="border border-border rounded-xl p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Disponibilité</label>
                        <select value={draft.availability} onChange={(e) => updateDraft(request.id, { availability: e.target.value as any })} className="w-full px-4 py-3 bg-background border border-border rounded-lg">
                          <option value="available">Disponible</option>
                          <option value="can_order">Sur commande</option>
                          <option value="unavailable">Indisponible</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prix proposé</label>
                        <input type="number" value={draft.proposedPrice} onChange={(e) => updateDraft(request.id, { proposedPrice: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" placeholder="Ex : 8500" />
                      </div>
                      <div className="flex items-end">
                        <button onClick={() => submitResponse(request.id)} className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2"><Send className="w-4 h-4" />Répondre</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message au client</label>
                      <textarea value={draft.message} onChange={(e) => updateDraft(request.id, { message: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg min-h-24" placeholder="Ex : Nous avons ce livre en stock. Vous pouvez passer en librairie ou commander depuis la plateforme." />
                    </div>
                  </div>
                )}

                {responses.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4" />Réponses déjà envoyées</p>
                    {responses.map((response) => (
                      <div key={response.id} className="bg-muted/30 rounded-lg p-3 text-sm">
                        <div className="flex justify-between gap-3 flex-wrap"><strong>{response.libraryName}</strong><span>{response.proposedPrice ? formatPrice(response.proposedPrice) : 'Prix non précisé'}</span></div>
                        <p className="text-muted-foreground">{response.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
