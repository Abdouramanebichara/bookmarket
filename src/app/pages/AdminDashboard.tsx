import { useNavigate } from 'react-router';
import { StatsCard } from '../components/StatsCard';
import { useLocalization } from '../context/LocalizationContext';
import { useAdminPlatform } from '../context/AdminPlatformContext';
import { MOCK_ORDERS } from '../data/mockData';
import { Users, Store, Package, DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { formatPrice } = useLocalization();
  const { users, libraries, visibleProducts, products, productReports } = useAdminPlatform();

  const revenue = MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeUsers = users.filter((user) => user.active).length;
  const activeLibraries = libraries.filter((library) => library.active).length;
  const pendingReports = productReports.filter((report) => report.status === 'pending' || report.status === 'reviewing').length;
  const removedProducts = products.length - visibleProducts.length;

  const userGrowthData = [
    { name: 'Jan', users: 120 },
    { name: 'Fév', users: 180 },
    { name: 'Mar', users: 250 },
    { name: 'Avr', users: 320 },
    { name: 'Mai', users: 410 },
    { name: 'Juin', users: activeUsers },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 450000 },
    { name: 'Fév', revenue: 520000 },
    { name: 'Mar', revenue: 680000 },
    { name: 'Avr', revenue: 750000 },
    { name: 'Mai', revenue: 890000 },
    { name: 'Juin', revenue },
  ];

  const recentActivity = [
    { action: 'Signalements en attente', user: `${pendingReports} livre(s) à vérifier`, time: 'Maintenant' },
    { action: 'Librairies actives', user: `${activeLibraries}/${libraries.length} librairies`, time: 'Aujourd’hui' },
    { action: 'Produits retirés', user: `${removedProducts} livre(s) masqué(s)`, time: 'Aujourd’hui' },
    { action: 'Comptes actifs', user: `${activeUsers}/${users.length} utilisateurs`, time: 'Aujourd’hui' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
            <p className="text-muted-foreground">Vue d'ensemble de la plateforme et actions de supervision</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Utilisateurs" value={`${activeUsers}/${users.length}`} change={15.2} icon={<Users className="w-6 h-6" />} description="actifs" />
          <StatsCard title="Librairies" value={`${activeLibraries}/${libraries.length}`} change={8.7} icon={<Store className="w-6 h-6" />} description="actives" />
          <StatsCard title="Produits visibles" value={visibleProducts.length} icon={<Package className="w-6 h-6" />} description={`${removedProducts} retiré(s)`} />
          <StatsCard title="Revenu Total" value={formatPrice(revenue)} change={22.4} icon={<DollarSign className="w-6 h-6" />} description="ventes mock" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => navigate('/admin/reports')} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-left hover:shadow-md transition-all">
            <AlertTriangle className="w-7 h-7 text-red-600 mb-2" />
            <p className="font-bold">Signalements</p>
            <p className="text-sm text-muted-foreground">{pendingReports} livre(s) à traiter</p>
          </button>
          <button onClick={() => navigate('/admin/validations')} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-left hover:shadow-md transition-all">
            <CheckCircle className="w-7 h-7 text-green-600 mb-2" />
            <p className="font-bold">Demandes librairie</p>
            <p className="text-sm text-muted-foreground">Accepter ou refuser les créations</p>
          </button>
          <button onClick={() => navigate('/admin/reports')} className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 text-left hover:shadow-md transition-all">
            <FileText className="w-7 h-7 text-indigo-600 mb-2" />
            <p className="font-bold">Rapport PDF</p>
            <p className="text-sm text-muted-foreground">Télécharger le rapport global</p>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Croissance des utilisateurs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0D1B3E" strokeWidth={2} name="Utilisateurs" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Évolution du revenu</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#F97316" name="Revenu (XAF)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Gestion des utilisateurs</h3>
            <p className="text-muted-foreground text-sm mb-4">Voir tous les comptes et activer/désactiver les clients.</p>
            <button onClick={() => navigate('/admin/users')} className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">Accéder</button>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Gestion des catégories</h3>
            <p className="text-muted-foreground text-sm mb-4">Ajouter, modifier, supprimer catégories et genres.</p>
            <button onClick={() => navigate('/admin/categories')} className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">Accéder</button>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Signalements</h3>
            <p className="text-muted-foreground text-sm mb-4">Examiner les livres signalés et retirer les contenus problématiques.</p>
            <button onClick={() => navigate('/admin/reports')} className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">Accéder</button>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-lg border border-border">
          <div className="p-6 border-b border-border"><h3 className="text-lg font-semibold">Activité récente</h3></div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.user}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
