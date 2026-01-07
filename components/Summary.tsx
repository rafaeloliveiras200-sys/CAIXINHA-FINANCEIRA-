
import React from 'react';
import { Cotista } from '../types';

interface SummaryProps {
  cotistas: Cotista[];
}

const Summary: React.FC<SummaryProps> = ({ cotistas }) => {
  const totalCotistas = cotistas.length;
  const pagos = cotistas.filter(c => c.paymentStatus === 'pago').length;
  const pendentes = totalCotistas - pagos;
  
  const totalArrecadado = cotistas
    .filter(c => c.paymentStatus === 'pago')
    .reduce((acc, c) => acc + 100 + (c.fine || 0), 0);
    
  const totalEmprestado = cotistas.reduce((acc, c) => acc + (c.loan?.amount || 0), 0);
  
  const dividaAtrasada = cotistas
    .filter(c => c.loan?.status === 'atrasado')
    .reduce((acc, c) => acc + (c.loan?.amount || 0) + (c.loan?.lateFee || 0), 0);

  const summaryData = [
    { label: 'Total de Cotistas', value: totalCotistas, color: 'text-blue-600' },
    { label: 'Pagamentos em Dia', value: pagos, color: 'text-green-600' },
    { label: 'Mensalidades Pendentes', value: pendentes, color: 'text-orange-600' },
    { label: 'Arrecadado no Mês', value: `R$ ${totalArrecadado.toFixed(2).replace('.', ',')}`, color: 'text-indigo-600' },
    { label: 'Total Emprestado', value: `R$ ${totalEmprestado.toFixed(2).replace('.', ',')}`, color: 'text-purple-600' },
    { label: 'Dívida Atrasada', value: `R$ ${dividaAtrasada.toFixed(2).replace('.', ',')}`, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {summaryData.map(item => (
        <div key={item.label} className="bg-white p-4 rounded-xl shadow-md border border-slate-200/80 text-center">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Summary;
