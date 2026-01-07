
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Assistente de Caixinha Financeira
        </h1>
        <p className="text-slate-500 mt-1">Seu painel de controle para uma gestão financeira simples e eficaz.</p>
      </div>
    </header>
  );
};
