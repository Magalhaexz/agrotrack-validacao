# AgroTrack Validação

Projeto simples em React + Vite com formulário próprio e integração com Supabase para validar a ideia do aplicativo.

## 1. Instalação

```bash
npm install
npm run dev
```

## 2. Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode o arquivo `supabase_schema.sql`.
4. Copie `.env.example` para `.env`.
5. Preencha:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 3. O que este projeto faz

- Exibe 15 perguntas diretas para validar a ideia do app.
- Calcula um score automático de validação.
- Salva todas as respostas na tabela `app_validation_responses`.
- Cria uma view `app_validation_summary` para leitura rápida no Supabase.

## 4. Leitura do score

- 0 a 8: ideia fraca ou mal posicionada
- 9 a 15: ideia promissora, mas precisa refino
- 16+: boa chance de validação real

## 5. Sinais de boa validação

- Mais de 70% relatam que a falta de informação atrapalha pelo menos às vezes
- Mais de 70% marcam `Útil` ou `Muito útil`
- Mais de 60% usariam pelo menos semanalmente
- Mais de 40% pagariam, ou mais de 70% ficam entre `Sim` e `Talvez`
