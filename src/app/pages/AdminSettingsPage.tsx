import { useState } from 'react';
import { Save, Settings, Shield, Mail, Percent, Globe, Lock } from 'lucide-react';
import { useAdminPlatform } from '../context/AdminPlatformContext';

export function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminPlatform();
  const [form, setForm] = useState(settings);

  const handleSave = () => {
    updateSettings(form);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center"><Settings className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-3xl font-bold">Paramètres de l’Application</h1>
              <p className="text-sm text-muted-foreground">Configurer les règles générales de BookMarket.</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-2"><Globe className="w-5 h-5" />Paramètres généraux</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l’application</label>
              <input value={form.appName} onChange={(e) => setForm({ ...form, appName: e.target.value })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email support</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Langue par défaut</label>
              <select value={form.defaultLanguage} onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value as 'fr' | 'en' })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Devise par défaut</label>
              <select value={form.defaultCurrency} onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value as 'XAF' | 'EUR' | 'USD' })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
                <option value="XAF">FCFA</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-border">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Shield className="w-5 h-5" />Règles métier</h2>
            <div className="space-y-4">
              <ToggleLine label="Mode maintenance" description="Désactive temporairement les actions publiques sensibles." checked={form.maintenanceMode} onChange={(value) => setForm({ ...form, maintenanceMode: value })} />
              <ToggleLine label="Inscription client autorisée" description="Autoriser la création de comptes clients." checked={form.allowClientSignup} onChange={(value) => setForm({ ...form, allowClientSignup: value })} />
              <ToggleLine label="Inscription librairie autorisée" description="Autoriser les demandes de création de librairie." checked={form.allowLibrarySignup} onChange={(value) => setForm({ ...form, allowLibrarySignup: value })} />
              <ToggleLine label="Validation librairie obligatoire" description="Une librairie doit être acceptée par l’administrateur avant activation." checked={form.requireLibraryValidation} onChange={(value) => setForm({ ...form, requireLibraryValidation: value })} />
            </div>
          </div>

          <div className="p-6 border-t border-border grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Percent className="w-4 h-4" />Commission plateforme (%)</label>
              <input type="number" min="0" max="100" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Lock className="w-4 h-4" />Longueur min. mot de passe</label>
              <input type="number" min="6" value={form.minPasswordLength} onChange={(e) => setForm({ ...form, minPasswordLength: Number(e.target.value) })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tentatives max connexion</label>
              <input type="number" min="1" value={form.maxLoginAttempts} onChange={(e) => setForm({ ...form, maxLoginAttempts: Number(e.target.value) })} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            </div>
          </div>

          <div className="p-6 border-t border-border">
            <button onClick={handleSave} className="w-full py-3 bg-purple-50 dark:bg-purple-950/20 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"><Save className="w-5 h-5" />Sauvegarder les paramètres</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleLine({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg gap-4">
      <div><p className="font-medium">{label}</p><p className="text-sm text-muted-foreground">{description}</p></div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
      </label>
    </div>
  );
}
