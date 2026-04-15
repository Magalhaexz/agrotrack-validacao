export function calculateValidationScore(data) {
  let score = 0

  if (data.works_with_beef === 'Sim') score += 1

  const control = data.current_control || []
  if (Array.isArray(control)) {
    if (control.includes('Caderno / papel')) score += 2
    if (control.includes('Planilha')) score += 1
    if (control.includes('WhatsApp')) score += 1
    if (control.includes('Não existe controle organizado')) score += 3
  }

  const decisionMap = {
    'Nunca': 0,
    'Raramente': 1,
    'Às vezes': 2,
    'Frequentemente': 3,
    'Sempre': 4,
  }
  score += decisionMap[data.decision_frequency] || 0

  const visibilityMap = {
    'Sim, com facilidade': 0,
    'Mais ou menos': 1,
    'Tenho dificuldade': 2,
    'Não consigo saber com segurança': 3,
  }
  score += visibilityMap[data.financial_visibility] || 0

  const impactMap = {
    'Nenhum impacto': 0,
    'Baixo impacto': 1,
    'Médio impacto': 2,
    'Alto impacto': 3,
    'Muito alto impacto': 4,
  }
  score += impactMap[data.financial_impact] || 0

  const utilityMap = {
    'Nada útil': 0,
    'Pouco útil': 1,
    'Mais ou menos útil': 2,
    'Útil': 3,
    'Muito útil': 4,
  }
  score += utilityMap[data.solution_utility] || 0

  const testMap = { 'Não': 0, 'Talvez': 1, 'Sim': 3 }
  score += testMap[data.would_test] || 0

  const usageMap = {
    'Quase nunca': 0,
    'Algumas vezes por mês': 1,
    'Uma vez por semana': 2,
    'Algumas vezes por semana': 3,
    'Todo dia': 4,
  }
  score += usageMap[data.usage_frequency] || 0

  const payMap = { 'Não': 0, 'Talvez': 1, 'Sim': 3 }
  score += payMap[data.would_pay] || 0

  return score
}

export function getScoreLabel(score) {
  if (score <= 8) return 'Ideia fraca ou mal posicionada'
  if (score <= 15) return 'Ideia promissora, mas precisa refino'
  return 'Boa chance de validação real'
}
