"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    { id: 1, question: "Você possui uma Reserva de Emergência separada do capital de giro da sua empresa?" },
    { id: 2, question: "Você sabe exatamente quantos meses de fôlego seu patrimônio atual garante?" },
    { id: 3, question: "Seus bens estão protegidos em uma estrutura jurídica segregada da empresa?" },
    { id: 4, question: "Existe um plano sucessório formalizado para seus herdeiros?" },
    { id: 5, question: "Você tem clareza sobre o custo anual de manutenção do seu patrimônio?" },
  ];

  const handleAnswer = (qId: number, answer: string) => {
    setAnswers({ ...answers, [qId]: answer });
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      router.push("/dashboard?diagnostic=completed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="panel p-8 lg:p-12">
        {step <= questions.length ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#b08a3e] uppercase tracking-[0.15em]">
                  Passo {step} de {questions.length}
                </span>
                <div className="flex gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i < step ? "w-6 bg-[#b08a3e]" : "w-2 bg-[#86837d]"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#efeae0] leading-tight">
                {questions[step - 1].question}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Sim", "Não", "Parcialmente"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(questions[step - 1].id, option)}
                  className="p-4 rounded-xl bg-[#16171b] border border-[#cfc6b4] hover:border-[#b08a3e] hover:bg-[rgba(176,138,62,0.1)] active:scale-[0.98] transition-all text-left flex items-center justify-between group"
                >
                  <span className="font-medium text-[#efeae0] group-hover:text-[#b08a3e]">{option}</span>
                  <ChevronRight size={18} className="text-[#86837d] group-hover:text-[#b08a3e] transition-colors" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[rgba(176,138,62,0.15)] border border-[rgba(176,138,62,0.3)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} className="text-[#b08a3e]" />
            </div>
            <h2 className="text-2xl font-bold text-[#efeae0] mb-3">Diagnóstico Concluído</h2>
            <p className="text-[#86837d] mb-8 max-w-md mx-auto leading-relaxed text-sm">
              Analisamos suas respostas com base no Método MAPA e geramos o seu perfil patrimonial.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 rounded-xl font-medium text-sm text-[#16171b] hover:bg-[#b08a3e] transition-all shadow-gold active:scale-[0.98]"
              style={{ background: "#b08a3e" }}
            >
              Ver Resultado no Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
