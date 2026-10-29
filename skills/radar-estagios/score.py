"""Radar de estágios: modelo de nota (0 a 100) e fila semanal.

Reproduz em Python a lógica da planilha usada pelo agente radar-estagios:
- nota = soma de (critério de 0 a 5 / 5 * peso)
- dado desconhecido vale 3 e entra em "a confirmar"
- etapas abertas entram todas, pelo prazo e depois pela nota (nota < 40: sugerir desistir)
- inscrições novas: no máximo 3 por semana, só com nota >= 60

Uso:
    python score.py exemplo_vagas.csv
    python score.py exemplo_vagas.csv --ja-inscritas 1
"""

from __future__ import annotations

import argparse
import csv
from dataclasses import dataclass, field
from datetime import date

PESOS = {
    "fit_longo_prazo": 15,
    "aprendizado": 15,
    "etapa_atual": 15,
    "efetivacao": 12,
    "prestigio": 10,
    "bolsa_beneficios": 10,
    "esforco": 10,
    "local": 7,
    "inicio": 6,
}
assert sum(PESOS.values()) == 100

DESCONHECIDO = 3
LIMITE_SEMANAL = 3
NOTA_MIN_INSCRICAO = 60
NOTA_SUGERIR_DESISTIR = 40


@dataclass
class Processo:
    empresa: str
    tipo: str  # "etapa aberta" ou "inscricao nova"
    prazo: date | None
    criterios: dict[str, int | None]
    a_confirmar: list[str] = field(default_factory=list)

    @property
    def nota(self) -> float:
        total = 0.0
        for criterio, peso in PESOS.items():
            valor = self.criterios.get(criterio)
            if valor is None:
                valor = DESCONHECIDO
            if not 0 <= valor <= 5:
                raise ValueError(f"{self.empresa}: {criterio}={valor} fora da régua 0 a 5")
            total += valor / 5 * peso
        return round(total, 1)


def ler_csv(caminho: str) -> list[Processo]:
    processos = []
    with open(caminho, newline="", encoding="utf-8") as f:
        for linha in csv.DictReader(f):
            criterios, a_confirmar = {}, []
            for criterio in PESOS:
                bruto = (linha.get(criterio) or "").strip()
                if bruto == "":
                    criterios[criterio] = None
                    a_confirmar.append(criterio)
                else:
                    criterios[criterio] = int(bruto)
            prazo = linha.get("prazo", "").strip()
            processos.append(
                Processo(
                    empresa=linha["empresa"],
                    tipo=linha["tipo"].strip().lower(),
                    prazo=date.fromisoformat(prazo) if prazo else None,
                    criterios=criterios,
                    a_confirmar=a_confirmar,
                )
            )
    return processos


def montar_fila(processos: list[Processo], ja_inscritas: int = 0):
    sem_prazo = date.max
    abertas = sorted(
        (p for p in processos if p.tipo == "etapa aberta"),
        key=lambda p: (p.prazo or sem_prazo, -p.nota),
    )
    candidatas = sorted(
        (p for p in processos if p.tipo == "inscricao nova" and p.nota >= NOTA_MIN_INSCRICAO),
        key=lambda p: (-p.nota, p.prazo or sem_prazo),
    )
    vagas_semana = max(0, LIMITE_SEMANAL - ja_inscritas)
    inscrever = candidatas[:vagas_semana]
    backlog = candidatas[vagas_semana:]
    fora = [p for p in processos if p.tipo == "inscricao nova" and p.nota < NOTA_MIN_INSCRICAO]
    return abertas, inscrever, backlog, fora


def imprimir(abertas, inscrever, backlog, fora):
    def linha(p: Processo) -> str:
        prazo = p.prazo.strftime("%d/%m") if p.prazo else "sem prazo"
        extra = f"  (a confirmar: {', '.join(p.a_confirmar)})" if p.a_confirmar else ""
        return f"  {p.nota:5.1f}  {p.empresa:<28} {prazo}{extra}"

    print("ETAPAS ABERTAS (todas, por prazo)")
    for p in abertas:
        aviso = "  ← nota < 40: sugerir desistir" if p.nota < NOTA_SUGERIR_DESISTIR else ""
        print(linha(p) + aviso)
    print(f"\nINSCRIÇÕES DESTA SEMANA (máx. {LIMITE_SEMANAL}, nota ≥ {NOTA_MIN_INSCRICAO})")
    for p in inscrever:
        print(linha(p))
    print("\nBACKLOG (passa na nota, fica para a próxima semana)")
    for p in backlog:
        print(linha(p))
    print(f"\nFORA (nota < {NOTA_MIN_INSCRICAO})")
    for p in fora:
        print(linha(p))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("csv")
    parser.add_argument("--ja-inscritas", type=int, default=0, help="inscrições novas já feitas nesta semana")
    args = parser.parse_args()
    imprimir(*montar_fila(ler_csv(args.csv), args.ja_inscritas))
