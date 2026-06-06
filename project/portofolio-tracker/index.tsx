import React, { useState, useEffect } from 'react';
import { 
  Wallet, PieChart, ArrowLeftRight, Star, TrendingUp, TrendingDown, 
  Activity, DollarSign, Search, Bell, LogOut, ChevronDown, Plus 
} from 'lucide-react';

// --- Mock Data ---
const MOCK_PORTFOLIO = {
  totalBalance: 45231.89,
  change24h: 1250.40,
  changePercent: +2.84,
  assets: [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', balance: 0.45, price: 64230.00, value: 28903.50, change: 1.2, color: '#F7931A' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', balance: 3.2, price: 3450.12, value: 11040.38, change: 4.5, color: '#627EEA' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', balance: 45.5, price: 145.20, value: 6606.60, change: -1.8, color: '#14F195' },
    { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', balance: 2500.00, price: 1.00, value: 2500.00, change: 0.01, color: '#2775CA' }
  ]
};

const MOCK_CHART_DATA = [32000, 31500, 34000, 33200, 36000, 35500, 38000, 41000, 39500, 42500, 44000, 45231];

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'Swap', from: 'USDC', to: 'ETH', amount: '1,500 USDC', date: 'Today, 14:30', status: 'Completed' },
  { id: 2, type: 'Receive', from: 'External', to: 'SOL', amount: '+12.5 SOL', date: 'Yesterday, 09:15', status: 'Completed' },
  { id: 3, type: 'Send', from: 'BTC', to: 'External', amount: '-0.05 BTC', date: 'Oct 24, 18:45', status: 'Completed' },
  { id: 4, type: 'Swap', from: 'ETH', to: 'USDC', amount: '0.5 ETH', date: 'Oct 22, 11:20', status: 'Completed' }
];

const MOCK_WATCHLIST = [
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 590.30, change: 2.1 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 18.45, change: 8.4 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.20, change: -0.5 },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', price: 35.60, change: 4.2 }
];

// --- Helper Components ---
const FormatCurrency = ({ value }: { value: number }) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Wallet Simulation
  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWalletAddress('0x7A2...9C4F');
      setWalletConnected(true);
      setIsConnecting(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  // SVG Line Chart Generator
  const renderChart = () => {
    const min = Math.min(...MOCK_CHART_DATA) * 0.95; // Add padding
    const max = Math.max(...MOCK_CHART_DATA) * 1.05;
    const range = max - min;
    
    const points = MOCK_CHART_DATA.map((val, i) => {
      const x = (i / (MOCK_CHART_DATA.length - 1)) * 100;
      const y = 100 - (((val - min) / range) * 100);
      return `${x},${y}`;
    }).join(' L ');

    return (
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0,100 L 0,${100 - (((MOCK_CHART_DATA[0] - min) / range) * 100)} L ${points} L 100,100 Z`} fill="url(#gradientArea)" />
        <path d={`M ${points}`} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // --- Views ---
  const DashboardView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#13141a] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-gray-400 font-medium mb-1">Total Portfolio Value</p>
              <h2 className="text-4xl font-bold text-white mb-2">
                {walletConnected ? <FormatCurrency value={MOCK_PORTFOLIO.totalBalance} /> : '$0.00'}
              </h2>
              {walletConnected && (
                <div className={`flex items-center gap-1.5 font-medium ${MOCK_PORTFOLIO.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {MOCK_PORTFOLIO.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{MOCK_PORTFOLIO.changePercent >= 0 ? '+' : ''}<FormatCurrency value={MOCK_PORTFOLIO.change24h} /> ({MOCK_PORTFOLIO.changePercent}%)</span>
                  <span className="text-gray-500 text-sm ml-1">24h</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((time, i) => (
                <button key={time} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${i === 2 ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-48 w-full mt-4 relative z-10">
            {walletConnected ? renderChart() : (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl text-gray-500">
                Connect wallet to view performance
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#13141a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Asset Allocation</h3>
          {walletConnected ? (
            <div className="space-y-4">
              {/* Fake Donut Chart via CSS bars */}
              <div className="flex w-full h-4 rounded-full overflow-hidden mb-6">
                {MOCK_PORTFOLIO.assets.map((asset) => (
                  <div key={asset.id} style={{ width: `${(asset.value / MOCK_PORTFOLIO.totalBalance) * 100}%`, backgroundColor: asset.color }} />
                ))}
              </div>
              
              <div className="space-y-3">
                {MOCK_PORTFOLIO.assets.map((asset) => {
                  const percentage = ((asset.value / MOCK_PORTFOLIO.totalBalance) * 100).toFixed(1);
                  return (
                    <div key={asset.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                        <span className="text-gray-300 font-medium">{asset.symbol}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500">No assets found</div>
          )}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-[#13141a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Your Assets</h3>
          <button className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
            Deposit <Plus size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Balance</th>
                <th className="p-4 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {walletConnected ? MOCK_PORTFOLIO.assets.map((asset) => (
                <tr key={asset.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: asset.color }}>
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold">{asset.name}</p>
                        <p className="text-gray-400 text-sm">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-white font-medium"><FormatCurrency value={asset.price} /></p>
                    <p className={`text-sm flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {asset.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(asset.change)}%
                    </p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-white font-medium">{asset.balance} {asset.symbol}</p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-white font-bold"><FormatCurrency value={asset.value} /></p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Connect your wallet to see your tokens
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TransactionsView = () => (
    <div className="bg-[#13141a] border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-white/5">
        {walletConnected ? MOCK_TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                tx.type === 'Swap' ? 'bg-violet-500/20 text-violet-400' :
                tx.type === 'Receive' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {tx.type === 'Swap' ? <ArrowLeftRight size={20} /> : tx.type === 'Receive' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div>
                <p className="text-white font-medium text-lg">{tx.type}</p>
                <p className="text-gray-400 text-sm">{tx.from} {tx.type === 'Swap' ? `→ ${tx.to}` : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-bold">{tx.amount}</p>
              <p className="text-gray-500 text-sm">{tx.date}</p>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-gray-500">No recent transactions found.</div>
        )}
      </div>
    </div>
  );

  const WatchlistView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-full mb-2 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">My Watchlist</h3>
        <button className="btn-primary px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 text-white bg-violet-600 hover:bg-violet-500 transition-colors">
          <Plus size={16} /> Add Coin
        </button>
      </div>
      
      {MOCK_WATCHLIST.map((coin) => (
        <div key={coin.id} className="bg-[#13141a] border border-white/5 rounded-2xl p-6 hover:border-violet-500/50 transition-colors cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                {coin.symbol[0]}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{coin.name}</p>
                <p className="text-gray-400 text-sm">{coin.symbol}</p>
              </div>
            </div>
            <button className="text-yellow-500 hover:text-yellow-400">
              <Star size={20} fill="currentColor" />
            </button>
          </div>
          <div className="flex justify-between items-end mt-6">
            <p className="text-2xl font-bold text-white"><FormatCurrency value={coin.price} /></p>
            <div className={`flex items-center gap-1 font-medium px-2 py-1 rounded-md text-sm ${coin.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {coin.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(coin.change)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-violet-500/30 flex">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0a0c] p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">NexusPort</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-violet-600/10 text-violet-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <PieChart size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'transactions' ? 'bg-violet-600/10 text-violet-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ArrowLeftRight size={20} /> Transactions
          </button>
          <button 
            onClick={() => setActiveTab('watchlist')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'watchlist' ? 'bg-violet-600/10 text-violet-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Star size={20} /> Watchlist
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-[#13141a] rounded-xl p-4 border border-white/5 text-center">
            <p className="text-sm font-medium text-white mb-2">Need Help?</p>
            <p className="text-xs text-gray-500 mb-3">Check our docs for API integrations.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white">View Docs</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Logo */}
            <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            
            <div className="hidden md:flex items-center bg-[#13141a] border border-white/5 rounded-full px-4 py-2 focus-within:border-violet-500/50 transition-colors w-64">
              <Search size={18} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Search tokens..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-600" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0c]"></span>
            </button>

            {walletConnected ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 bg-[#13141a] border border-white/5 hover:border-violet-500/50 rounded-full py-1.5 pl-2 pr-4 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 flex items-center justify-center border-2 border-[#0a0a0c]">
                     <Wallet size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide">{walletAddress}</span>
                  <ChevronDown size={14} className="text-gray-500 ml-1" />
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#13141a] border border-white/5 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                  <button onClick={handleDisconnect} className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-white/5 flex items-center gap-2">
                    <LogOut size={16} /> Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet} 
                disabled={isConnecting}
                className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isConnecting ? <Activity size={18} className="animate-spin" /> : <Wallet size={18} />}
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex overflow-x-auto p-4 border-b border-white/5 bg-[#0a0a0c] no-scrollbar gap-2">
          {['dashboard', 'transactions', 'watchlist'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap capitalize transition-all ${activeTab === tab ? 'bg-violet-600 text-white' : 'bg-[#13141a] text-gray-400 border border-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8 flex-1">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'transactions' && <TransactionsView />}
          {activeTab === 'watchlist' && <WatchlistView />}
        </div>
      </main>
    </div>
  );
}