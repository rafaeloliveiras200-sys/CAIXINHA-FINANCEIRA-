
import React from 'react';

const RulesCard: React.FC = () => {
  const rules = [
    { title: 'Pagamento Mensal', value: 'R$ 100,00 todo dia 10' },
    { title: 'Multa por Atraso', value: 'R$ 20,00 (mensalidade)' },
    { title: 'Sorteios Anuais', value: 'Maio e Agosto' },
    { title: 'Limite de Empréstimos', value: 'Até 3 por cotista' },
    { title: 'Juros Empréstimo Atrasado', value: '10% sobre o valor' },
    { title: 'Liberação de Empréstimos', value: 'Somente no dia 10 de novembro' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Regras da Caixinha</h3>
      <ul className="space-y-3 text-sm">
        {rules.map((rule, index) => (
          <li key={index} className="flex justify-between items-center gap-2">
            <span className="text-slate-600 flex-shrink-0">{rule.title}</span>
            <span className="font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-right">{rule.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RulesCard;
