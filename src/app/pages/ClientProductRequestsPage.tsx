import { useState } from 'react';
import { Search, Send, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocalization } from '../context/LocalizationContext';
import { useProductRequests } from '../context/ProductRequestsContext';

export function ClientProductRequestsPage() {
  const { user } = useAuth();
  const { formatPrice } = useLocalization();
  const { createRequest, getClientRequests, getRequestResponses, closeRequest } = useProductRequests();
  const [form, setForm] = useState({ title: '', author: '', category: '', budget: '', city: user?.city || 'Yaoundé', description: '', urgency: 'normal' as 'normal' | 'urgent' });

  const requests = getClientRequests(user?.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title.trim()) return;
    createRequest({
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      title: form.title.trim(),
      author: form.author.trim() || undefined,
      category: form.category.trim() || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      city: form.city.trim() || undefined,
      description: form.description.trim() || undefined,
      urgency: form.urgency,
    });
    setForm({ title: '', author: '', category: '', budget: '', city: user.city || 'Yaoundé', description: '', urgency: 'normal' });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"><Search className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-3xl font-bold">Mes demandes de produits</h1>
            <p className="text-sm text-muted-foreground">Demandez un livre ou un article introuvable. Toutes les librairies pourront vous répondre.</p>
          </div>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre recherché *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" placeholder="Titre du livre ou de l’article" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Auteur / marque</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" placeholder="Auteur, éditeur, marque..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" placeholder="Livre, manuel, fourniture..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget indicatif</label>
            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" placeholder="10000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ville</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priorité</label>
            <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as any })} className="w-full px-4 py-3 bg-background border border-border rounded-lg">
              <option value="normal">Normale</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Détails complémentaires</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg min-h-28" placeholder="Niveau scolaire, édition, format, quantité souhaitée..." />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2"><Send className="w-5 h-5" />Envoyer aux librairies</button>
          </div>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Historique des demandes</h2>
          {requests.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">Aucune demande envoyée pour le moment.</div>
          ) : requests.map((request) => {
            const responses = getRequestResponses(request.id);
            return (
              <div key={request.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{request.title}</h3>
                    <p className="text-sm text-muted-foreground">{request.author || 'Auteur non précisé'} · {request.category || 'Catégorie non précisée'} · {request.city || 'Ville non précisée'}</p>
                    {request.budget && <p className="text-sm text-muted-foreground">Budget : {formatPrice(request.budget)}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'open' ? 'bg-yellow-100 text-yellow-800' : request.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {request.status === 'open' ? 'En attente' : request.status === 'answered' ? 'Réponses reçues' : 'Clôturée'}
                  </span>
                </div>
                {request.description && <p className="text-sm mb-4">{request.description}</p>}
                <div className="space-y-3">
                  {responses.length === 0 ? <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Aucune réponse pour le moment.</p> : responses.map((response) => (
                    <div key={response.id} className="border border-border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                        <p className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" />{response.libraryName}</p>
                        <span className="text-sm font-semibold text-emerald-600">{response.proposedPrice ? formatPrice(response.proposedPrice) : 'Prix à confirmer'}</span>
                      </div>
                      <p className="text-sm mb-1">{response.message}</p>
                      <p className="text-xs text-muted-foreground">Disponibilité : {response.availability === 'available' ? 'disponible' : response.availability === 'can_order' ? 'sur commande' : 'indisponible'} {response.contactPhone ? `· Contact : ${response.contactPhone}` : ''}</p>
                    </div>
                  ))}
                </div>
                {request.status !== 'closed' && (
                  <button onClick={() => closeRequest(request.id)} className="mt-4 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />Clôturer la demande</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
