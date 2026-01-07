
import React, { useState, useEffect } from 'react';
import { Cotista } from './types';
import RulesCard from './components/RulesCard';
import Summary from './components/Summary';
import MemberList from './components/MemberList';
import ChatInterface from './components/ChatInterface';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [cotistas, setCotistas] = useState<Cotista[]>([
    { id: 1, name: 'Ana Silva', paymentStatus: 'pago' },
    { id: 2, name: 'Bruno Costa', paymentStatus: 'pendente', fine: 20, loan: { amount: 500, dueDate: '2024-05-10', status: 'pendente' } },
    { id: 3, name: 'Carlos Dias', paymentStatus: 'pago', loan: { amount: 300, dueDate: '2024-06-10', status: 'pendente' } },
    { id: 4, name: 'Daniela Souza', paymentStatus: 'pago' },
    { id: 5, name: 'Eduardo Lima', paymentStatus: 'pendente' },
  ]);

  // Simula a verificação de datas de vencimento de empréstimos ao carregar o app
  useEffect(() => {
    const TODAY = new Date('2024-06-15'); // Data simulada para demonstração
    
    setCotistas(prevCotistas =>
      prevCotistas.map(c => {
        if (c.loan && c.loan.status === 'pendente' && new Date(c.loan.dueDate) < TODAY) {
          return {
            ...c,
            loan: {
              ...c.loan,
              status: 'atrasado',
              lateFee: c.loan.amount * 0.10,
            },
          };
        }
        return c;
      })
    );
  }, []);

  const handleAddCotista = (name: string) => {
    if (name.trim()) {
      const newCotista: Cotista = {
        id: Date.now(),
        name,
        paymentStatus: 'pendente',
      };
      setCotistas(prevCotistas => [...prevCotistas, newCotista]);
    }
  };

  const handleTogglePaymentStatus = (id: number) => {
    setCotistas(prevCotistas =>
      prevCotistas.map(c =>
        c.id === id
          ? { ...c, paymentStatus: c.paymentStatus === 'pago' ? 'pendente' : 'pago' }
          : c
      )
    );
  };
  
  const handleRemoveCotista = (id: number) => {
    setCotistas(prevCotistas => prevCotistas.filter(c => c.id !== id));
  };

  const handleToggleFine = (id: number) => {
    setCotistas(prevCotistas =>
      prevCotistas.map(c => {
        if (c.id === id) {
          return { ...c, fine: c.fine ? undefined : 20 };
        }
        return c;
      })
    );
  };

  const handleAddOrUpdateLoan = (cotistaId: number, amount: number, dueDate: string) => {
    setCotistas(prevCotistas =>
      prevCotistas.map(c => {
        if (c.id === cotistaId) {
          return {
            ...c,
            loan: {
              amount,
              dueDate,
              status: 'pendente', // Always reset status on update/add
              lateFee: undefined, // Clear any previous late fee
            },
          };
        }
        return c;
      })
    );
  };

  const handleRemoveLoan = (cotistaId: number) => {
    setCotistas(prevCotistas =>
      prevCotistas.map(c => {
        if (c.id === cotistaId) {
          const { loan, ...rest } = c; // Destructure to remove loan property
          return rest;
        }
        return c;
      })
    );
  };


  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Summary cotistas={cotistas} />
            <MemberList 
              cotistas={cotistas} 
              onAddCotista={handleAddCotista}
              onTogglePaymentStatus={handleTogglePaymentStatus}
              onRemoveCotista={handleRemoveCotista}
              onToggleFine={handleToggleFine}
              onAddOrUpdateLoan={handleAddOrUpdateLoan}
              onRemoveLoan={handleRemoveLoan}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <RulesCard />
            <ChatInterface cotistas={cotistas} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
