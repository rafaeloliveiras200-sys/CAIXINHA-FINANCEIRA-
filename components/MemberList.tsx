
import React, { useState, useEffect } from 'react';
import { Cotista } from '../types';
import { CheckCircleIcon, XCircleIcon, PlusIcon, TrashIcon, CurrencyDollarIcon, ExclamationTriangleIcon, PencilSquareIcon } from './Icons';

interface LoanEditFormProps {
  cotista: Cotista;
  onSave: (cotistaId: number, amount: number, dueDate: string) => void;
  onRemove: (cotistaId: number) => void;
  onCancel: () => void;
}

const LoanEditForm: React.FC<LoanEditFormProps> = ({ cotista, onSave, onRemove, onCancel }) => {
  const [amount, setAmount] = useState(cotista.loan?.amount || '');
  const [dueDate, setDueDate] = useState(cotista.loan?.dueDate || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.toString());
    if (numAmount > 0 && dueDate) {
      onSave(cotista.id, numAmount, dueDate);
    }
  };
  
  const handleRemove = () => {
    if (window.confirm(`Tem certeza que deseja remover o empréstimo de ${cotista.name}?`)) {
      onRemove(cotista.id);
    }
  };

  return (
    <div className="mt-4 p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
      <h4 className="font-semibold text-slate-800 mb-2">Gerenciar Empréstimo para: <span className="text-indigo-600">{cotista.name}</span></h4>
      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-1">
          <label htmlFor="loanAmount" className="block text-sm font-medium text-slate-700">Valor (R$)</label>
          <input
            id="loanAmount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 500"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Data Vencimento</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-2">
          {cotista.loan && (
            <button type="button" onClick={handleRemove} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Remover
            </button>
          )}
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};


interface MemberListProps {
  cotistas: Cotista[];
  onAddCotista: (name: string) => void;
  onTogglePaymentStatus: (id: number) => void;
  onRemoveCotista: (id: number) => void;
  onToggleFine: (id: number) => void;
  onAddOrUpdateLoan: (cotistaId: number, amount: number, dueDate: string) => void;
  onRemoveLoan: (cotistaId: number) => void;
}

const MemberList: React.FC<MemberListProps> = ({ cotistas, onAddCotista, onTogglePaymentStatus, onRemoveCotista, onToggleFine, onAddOrUpdateLoan, onRemoveLoan }) => {
  const [newName, setNewName] = useState('');
  const [editingLoanCotista, setEditingLoanCotista] = useState<Cotista | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCotista(newName);
    setNewName('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Gerenciamento de Cotistas</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome do novo cotista"
            className="flex-grow px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <PlusIcon className="w-5 h-5" />
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status Mensalidade</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empréstimo</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {cotistas.map(cotista => (
                <tr key={cotista.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cotista.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {cotista.paymentStatus === 'pago' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <XCircleIcon className="w-4 h-4 text-orange-600" />
                        Pendente {cotista.fine ? `(+R$${cotista.fine})` : ''}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {!cotista.loan ? (
                       <span className="text-slate-400">---</span>
                    ) : cotista.loan.status === 'atrasado' ? (
                      <div className="flex items-center gap-2 text-red-600" title={`Juros de R$${cotista.loan.lateFee?.toFixed(2)} aplicados`}>
                        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <div className="font-bold">Atrasado</div>
                          <div className="text-xs">
                            Total: R$ {(cotista.loan.amount + (cotista.loan.lateFee || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-green-700 font-medium">
                        R$ {cotista.loan.amount.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center space-x-1">
                     <button onClick={() => onTogglePaymentStatus(cotista.id)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors" title={cotista.paymentStatus === 'pago' ? 'Marcar mensalidade como pendente' : 'Marcar mensalidade como paga'}>
                       {cotista.paymentStatus === 'pago' ? 'Pendente?' : 'Pago?'}
                     </button>
                     
                     {cotista.paymentStatus === 'pendente' && (
                       <button 
                          onClick={() => onToggleFine(cotista.id)} 
                          className={`p-1 rounded-full transition-colors ${
                              cotista.fine 
                              ? 'text-red-600 hover:bg-red-100' 
                              : 'text-yellow-600 hover:bg-yellow-100'
                          }`}
                          title={cotista.fine ? 'Remover Multa da Mensalidade' : 'Aplicar Multa na Mensalidade'}
                      >
                          <CurrencyDollarIcon className="w-5 h-5" />
                      </button>
                     )}

                     <button onClick={() => setEditingLoanCotista(cotista)} className="text-slate-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors" title="Gerenciar Empréstimo">
                       <PencilSquareIcon className="w-5 h-5 inline-block"/>
                     </button>
  
                     <button onClick={() => onRemoveCotista(cotista.id)} className="text-slate-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors" title="Remover Cotista">
                       <TrashIcon className="w-5 h-5 inline-block"/>
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingLoanCotista && (
        <LoanEditForm
          cotista={editingLoanCotista}
          onSave={(id, amount, date) => {
            onAddOrUpdateLoan(id, amount, date);
            setEditingLoanCotista(null);
          }}
          onRemove={(id) => {
            onRemoveLoan(id);
            setEditingLoanCotista(null);
          }}
          onCancel={() => setEditingLoanCotista(null)}
        />
      )}
    </div>
  );
};

export default MemberList;
