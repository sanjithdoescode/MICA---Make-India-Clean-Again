import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Download, X, CheckCircle, Clock, AlertCircle, User, MapPin, ChevronDown } from 'lucide-react';
import { EvidenceScore } from '../components/EvidenceScore';

type TicketStatus = 'Pending' | 'Assigned' | 'Resolved' | 'Escalated';

interface Ticket {
  id: string;
  photoColor: string;
  location: string;
  ward: string;
  category: string;
  evidenceScore: number;
  status: TicketStatus;
  reportedAt: string;
  assignee?: string;
}

const statusConfig: Record<TicketStatus, { bg: string; text: string; icon: typeof Clock }> = {
  Pending:   { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: Clock },
  Assigned:  { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: User },
  Resolved:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: CheckCircle },
  Escalated: { bg: 'bg-red-100',    text: 'text-red-700',    icon: AlertCircle },
};

const photoColors = [
  'from-green-300 to-green-500', 'from-amber-300 to-amber-500',
  'from-slate-300 to-slate-500', 'from-red-300 to-red-500',
  'from-blue-300 to-blue-500',   'from-purple-300 to-purple-500',
];

const collectors = [
  'Rajan (Zone A)', 'Murugan (Zone B)', 'Selvi (Zone C)', 'Karthik (Zone D)',
];

const sampleTickets: Ticket[] = [
  { id: 'RPT-A3F8', photoColor: photoColors[0], location: 'Goripalayam Market Rd', ward: 'Ward 14', category: 'Illegal Dump',  evidenceScore: 0.91, status: 'Pending',   reportedAt: '09:14 AM' },
  { id: 'RPT-B7C2', photoColor: photoColors[1], location: 'KK Nagar, 3rd Cross',   ward: 'Ward 22', category: 'Medical Waste', evidenceScore: 0.83, status: 'Assigned',  reportedAt: '10:32 AM', assignee: 'Rajan (Zone A)' },
  { id: 'RPT-D9E1', photoColor: photoColors[2], location: 'Anna Nagar 5th St',     ward: 'Ward 8',  category: 'Unsorted',      evidenceScore: 0.54, status: 'Pending',   reportedAt: '11:05 AM' },
  { id: 'RPT-F2A4', photoColor: photoColors[3], location: 'Sellur Bus Terminus',   ward: 'Ward 5',  category: 'Illegal Dump',  evidenceScore: 0.31, status: 'Escalated', reportedAt: '11:47 AM' },
  { id: 'RPT-G6H9', photoColor: photoColors[4], location: 'Tallakulam Tank Bund',  ward: 'Ward 31', category: 'Illegal Dump',  evidenceScore: 0.76, status: 'Resolved',  reportedAt: '01:18 PM', assignee: 'Selvi (Zone C)' },
  { id: 'RPT-J1K3', photoColor: photoColors[5], location: 'Palanganatham Lake Rd', ward: 'Ward 19', category: 'Medical Waste', evidenceScore: 0.69, status: 'Pending',   reportedAt: '02:40 PM' },
  { id: 'RPT-L8M0', photoColor: photoColors[0], location: 'Mattuthavani, Block 2', ward: 'Ward 7',  category: 'Unsorted',      evidenceScore: 0.47, status: 'Assigned',  reportedAt: '03:12 PM', assignee: 'Murugan (Zone B)' },
];

export default function MunicipalDashboard() {
  const [tickets, setTickets]           = useState<Ticket[]>(sampleTickets);
  const [assignModalId, setAssignModalId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');

  const filteredTickets = statusFilter === 'All'
    ? tickets
    : tickets.filter((t) => t.status === statusFilter);

  const assignTicket = (ticketId: string, collector: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: 'Assigned', assignee: collector } : t
      )
    );
    setAssignModalId(null);
  };

  const pendingCount  = tickets.filter((t) => t.status === 'Pending').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const escalatedCount= tickets.filter((t) => t.status === 'Escalated').length;

  return (
    <div className="min-h-screen bg-[#f4f3f0] px-6 pt-8 pb-10">
      {/* Dashboard header */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-civic-slate-dark mb-1.5">
              Municipal Operations · Madurai Corporation
            </p>
            <h1 className="font-serif font-black text-display-md text-civic-navy">
              Ward <span className="italic text-civic-green">Oversight</span>
            </h1>
            <p className="font-sans text-sm text-civic-slate-dark mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-civic-slate-mid bg-white font-sans text-sm font-medium text-civic-navy hover:border-civic-navy transition-colors">
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Today',  value: tickets.length,  color: 'text-civic-navy',    sub: 'reports filed' },
            { label: 'Pending',      value: pendingCount,     color: 'text-civic-amber',   sub: 'need assignment' },
            { label: 'Resolved',     value: resolvedCount,    color: 'text-civic-green',   sub: 'this session' },
            { label: 'Escalated',    value: escalatedCount,   color: 'text-civic-crimson', sub: 'require review' },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-civic-slate-mid p-5 shadow-sm">
              <p className="font-sans text-xs uppercase tracking-widest text-civic-slate-dark mb-2">{label}</p>
              <p className={`font-serif font-black text-4xl ${color}`}>{value}</p>
              <p className="font-sans text-xs text-civic-slate-dark mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-3 mb-5">
          <Filter size={16} className="text-civic-slate-dark" />
          <p className="font-sans text-sm text-civic-slate-dark font-medium mr-2">Filter:</p>
          {(['All', 'Pending', 'Assigned', 'Resolved', 'Escalated'] as (TicketStatus | 'All')[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold transition-all duration-150
                ${statusFilter === f
                  ? 'bg-civic-navy text-white shadow-sm'
                  : 'bg-white border border-civic-slate-mid text-civic-navy/70 hover:border-civic-navy/40'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-civic-slate-mid overflow-hidden shadow-sm">
          {/* Table head */}
          <div className="grid grid-cols-[100px_80px_1fr_100px_150px_140px_140px] gap-4 px-5 py-3.5 bg-civic-slate border-b border-civic-slate-mid">
            {['Ticket ID', 'Photo', 'Location', 'Category', 'Evidence Score', 'Status', 'Action'].map((h) => (
              <p key={h} className="font-sans text-xs font-semibold uppercase tracking-widest text-civic-slate-dark flex items-center gap-1">
                {h}
                {h === 'Evidence Score' && <ChevronDown size={12} />}
              </p>
            ))}
          </div>

          {/* Table rows */}
          <AnimatePresence>
            {filteredTickets.map((ticket, i) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                idx={i}
                total={filteredTickets.length}
                onAssign={() => setAssignModalId(ticket.id)}
              />
            ))}
          </AnimatePresence>

          {filteredTickets.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-serif italic text-xl text-civic-slate-dark">No tickets match this filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign modal */}
      <AnimatePresence>
        {assignModalId && (
          <AssignModal
            ticketId={assignModalId}
            collectors={collectors}
            onAssign={(collector) => assignTicket(assignModalId, collector)}
            onClose={() => setAssignModalId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TicketRow({ ticket, idx, total, onAssign }: {
  ticket: Ticket;
  idx: number;
  total: number;
  onAssign: () => void;
}) {
  const statusCfg = statusConfig[ticket.status];
  const StatusIcon = statusCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
      className={`grid grid-cols-[100px_80px_1fr_100px_150px_140px_140px] gap-4 items-center px-5 py-4
        ${idx < total - 1 ? 'border-b border-civic-slate-mid' : ''}
        hover:bg-civic-slate/50 transition-colors group`}
    >
      {/* Ticket ID */}
      <p className="font-mono text-xs font-semibold text-civic-navy">{ticket.id}</p>

      {/* Photo thumb */}
      <div className={`w-14 h-10 rounded-lg bg-gradient-to-br ${ticket.photoColor} flex items-center justify-center`}>
        <span className="font-sans text-[9px] text-white font-bold opacity-70">IMG</span>
      </div>

      {/* Location */}
      <div>
        <p className="font-sans text-sm text-civic-navy font-medium leading-tight">{ticket.location}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-civic-slate-dark" />
          <p className="font-sans text-xs text-civic-slate-dark">{ticket.ward}</p>
        </div>
      </div>

      {/* Category */}
      <p className="font-sans text-xs text-civic-navy/70 font-medium">{ticket.category}</p>

      {/* Evidence score */}
      <EvidenceScore score={ticket.evidenceScore} />

      {/* Status */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg w-fit ${statusCfg.bg}`}>
        <StatusIcon size={12} className={statusCfg.text} />
        <span className={`font-sans text-xs font-semibold ${statusCfg.text}`}>{ticket.status}</span>
      </div>

      {/* Action */}
      <div>
        {ticket.status === 'Pending' ? (
          <motion.button
            onClick={onAssign}
            className="px-3 py-1.5 bg-civic-green text-white rounded-lg font-sans text-xs font-semibold hover:bg-opacity-90 transition-colors shadow-sm"
            whileTap={{ scale: 0.96 }}
          >
            Assign
          </motion.button>
        ) : ticket.assignee ? (
          <p className="font-sans text-xs text-civic-slate-dark truncate">{ticket.assignee}</p>
        ) : (
          <span className="font-sans text-xs text-civic-slate-dark">—</span>
        )}
      </div>
    </motion.div>
  );
}

function AssignModal({ ticketId, collectors, onAssign, onClose }: {
  ticketId: string;
  collectors: string[];
  onAssign: (collector: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-civic-navy/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-white rounded-2xl border border-civic-slate-mid shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-civic-slate-dark mb-1">Assign Ticket</p>
            <p className="font-mono text-base font-semibold text-civic-navy">{ticketId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-civic-slate flex items-center justify-center hover:bg-civic-slate-mid transition-colors"
          >
            <X size={16} className="text-civic-navy" />
          </button>
        </div>

        <p className="font-sans text-sm text-civic-slate-dark mb-4">
          Select a micro-franchise collector for this ticket:
        </p>

        <div className="space-y-2">
          {collectors.map((collector) => (
            <motion.button
              key={collector}
              onClick={() => onAssign(collector)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-civic-slate-mid hover:border-civic-green hover:bg-civic-green/5 transition-all duration-150 group"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-civic-green/10 flex items-center justify-center">
                  <User size={14} className="text-civic-green" />
                </div>
                <span className="font-sans text-sm font-medium text-civic-navy">{collector}</span>
              </div>
              <CheckCircle size={16} className="text-civic-slate-mid group-hover:text-civic-green transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
