
import { GoogleGenAI } from "@google/genai";
import { Cotista } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (cotistas: Cotista[]): string => {
  const cotistasList = cotistas.map(c => {
    let details = `- ${c.name}: `;
    details += c.paymentStatus === 'pago' ? 'Pagamento da mensalidade em dia' : 'Pagamento da mensalidade pendente';
    if (c.fine) {
      details += ` (Multa de R$${c.fine},00 aplicada)`;
    }
    if (c.loan) {
      details += `. Empréstimo de R$${c.loan.amount.toFixed(2)}. Status do empréstimo: ${c.loan.status}.`;
      if (c.loan.status === 'atrasado' && c.loan.lateFee) {
        const totalDebt = c.loan.amount + c.loan.lateFee;
        details += ` Com juros de R$${c.loan.lateFee.toFixed(2)}, a dívida total do empréstimo é R$${totalDebt.toFixed(2)}.`;
      }
    }
    return details;
  }).join('\n');

  return `
    Você é um assistente financeiro especialista em "caixinhas", um tipo de clube de poupança informal popular no Brasil. Sua personalidade é prestativa, clara e profissional.

    Sua principal função é responder a perguntas com base nas regras estritas da caixinha e na lista atual de membros (cotistas).

    **REGRAS DA CAIXINHA (não podem ser alteradas):**
    - **Pagamento Mensal:** R$ 100,00, com vencimento todo dia 10 de cada mês.
    - **Multa por Atraso de Mensalidade:** R$ 20,00 de multa fixa para pagamentos feitos após o dia 10.
    - **Sorteios:** Ocorrem duas vezes por ano, nos meses de Maio e Agosto.
    - **Empréstimos:**
        - Cada cotista tem direito a solicitar até 3 empréstimos durante o ciclo da caixinha.
        - Todos os empréstimos têm uma taxa de juros fixa obrigatória.
        - Empréstimos são liberados para os cotistas apenas no dia 10 de novembro.
        - **NOVA REGRA: Se o pagamento de um empréstimo atrasar, será cobrado um juro de 10% sobre o valor original do empréstimo.**

    **LISTA ATUAL DE COTISTAS E SEUS STATUS:**
    ${cotistasList}

    **COMO VOCÊ DEVE RESPONDER:**
    1.  **Baseie-se nos Fatos:** Use SEMPRE as regras e a lista de cotistas fornecidas para formular suas respostas.
    2.  **Seja Direto e Claro:** Responda em português do Brasil, de forma organizada. Use listas ou negrito para destacar informações importantes.
    3.  **Cálculos:** Se pedirem para calcular multas ou juros, faça o cálculo passo a passo. Ex: "O empréstimo de R$500,00 está atrasado. O juro é 10% de R$500,00, que é R$50,00. O total a ser pago é R$500,00 + R$50,00 = R$550,00."
    4.  **Informações Faltantes:** Se uma pergunta não puder ser respondida com os dados fornecidos, informe que essa informação precisa ser definida pelo administrador da caixinha.
    5.  **Não opine:** Mantenha-se neutro e focado nas regras. Não dê conselhos financeiros pessoais.

    Agora, responda à pergunta do usuário.
  `;
};

export const askFinancialAssistant = async (prompt: string, cotistas: Cotista[]): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(cotistas);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    
    if (response.text) {
        return response.text;
    }

    return "Não consegui processar a sua pergunta. Tente novamente.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao conectar com o assistente. Por favor, verifique a configuração da sua chave de API e tente novamente.";
  }
};
