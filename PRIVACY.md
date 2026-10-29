# Privacidade · Privacy

Este repositório é uma **vitrine** do sistema, não uma cópia dele. O sistema real roda no meu Google Workspace e no Claude, com dados pessoais que não saem de lá.

## O que foi tirado
- Dados de saúde, de família e de terceiros.
- Endereços, telefones e rotinas de deslocamento.
- IDs de arquivos, pastas, planilhas e agendas.
- Nomes de pessoas (recrutadoras, professores, mentores).
- Notas reais dadas a empresas e o status dos meus processos seletivos.
- Skills de uso estritamente pessoal.

## O que foi trocado
- Exemplos de vagas usam empresas fictícias ("Empresa A").
- Skills publicadas são versões resumidas, com o mesmo método e sem os dados.

## Limpeza das peças publicadas em 29/10/2026

Regra do sistema que vale aqui também (P7): **conteúdo de saúde e de autoconhecimento nunca vai para página publicada.**

| Onde | O que saiu | Por quê |
|---|---|---|
| Skills (`encerrar-chat`, `proposta-da-semana`, `resumo-da-manha`, `nomear-e-arquivar`, `faxina-arquivos`, `preparar-processo-seletivo`) | IDs de documentos, planilhas e agendas; URLs privadas; meu e-mail e nome completo; nomes de profissionais, colegas e projetos de terceiros; empresas e vagas reais e o resultado dos processos; nomes e códigos de disciplinas (viraram MAT1, MAT2…); locais e endereços; tudo o que é de saúde; regras de login | dado pessoal, de terceiros ou que abre acesso |
| Skills (texto) | Meu nome virou "a pessoa"; o nome do sistema e das peças que levavam meu apelido virou genérico (ex.: `nomear-e-arquivar`, `app-pessoal-v0.2`) | o método é o que interessa, não a pessoa |
| Agendas | Nomes pessoais das agendas viraram genéricos (Faculdade, Carreira, Bem-estar, Projetos, Social e Lazer…); a lógica sugestões × área × visualização ficou | mostra o desenho sem expor a rotina |
| `apps-script/` | IDs de agendas e da planilha de registro (agora vêm das Propriedades do script); e-mail da dona; remetentes, lojas, empresas e serviços das regras do Gmail (viraram padrões genéricos); disciplinas e projetos das regras do vigia; impressões digitais (SHA-256) da versão real do app | dado pessoal ou identificador; a versão publicada é outra, então as impressões digitais não valeriam |
| `templates/mapa-schema.md` | Todos os dados reais do Mapa | só o formato é publicado, com 2 ou 3 linhas fictícias |
| `docs/lessons.md` | Aprendizados ligados a conversas pessoais, aparelhos, senhas e nomes | ficaram só os limites das ferramentas |
| `docs/case-study*.md` | Saúde, família, lugares e terceiros | os números vêm do Mapa e dos registros, sem nenhum dado pessoal por trás |

*This repository is a showcase. Health, family and third-party data, addresses, file IDs, people's names and real hiring statuses were removed or replaced with fictional examples. In the skills and scripts published on Oct 29, 2026, IDs now come from script properties, real senders, companies, courses and places became generic patterns, and nothing health-related was kept.*
