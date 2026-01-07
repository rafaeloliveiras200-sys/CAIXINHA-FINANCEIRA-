
export interface Loan {
  amount: number;
  dueDate: string; // ISO string like '2024-05-20'
  status: 'pago' | 'pendente' | 'atrasado';
  lateFee?: number;
}

export interface Cotista {
  id: number;
  name: string;
  paymentStatus: 'pago' | 'pendente';
  fine?: number;
  loan?: Loan;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
}
