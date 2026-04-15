import { useState } from 'react'
import { supabase } from './lib/supabase'
import { questions } from './questions'
import './styles.css'

function calcularScore(form) {
  let score = 0

  if (form.works_with_beef === 'Sim') score += 2
  if (['Às vezes', 'Frequentemente', 'Sempre'].includes(form.decision_frequency)) score += 3
  if (['Tenho dificuldade', 'Não consigo saber com segurança'].includes(form.financial_visibility)) score += 3
  if (['Médio impacto', 'Alto impacto', 'Muito alto impacto'].includes(form.financial_impact)) score += 3
  if (['Útil', 'Muito útil'].includes(form.solution_utility)) score += 4
  if (form.would_test === 'Sim') score += 3
  else if (form.would_test === 'Talvez') score += 1
  if (['Todo dia', 'Algumas vezes por semana', 'Uma vez por semana'].includes(form.usage_frequency)) score += 3
  if (form.would_pay === 'Sim') score += 3
  else if (form.would_pay === 'Talvez') score += 1

  let scoreLabel = 'Ideia fraca ou mal posicionada'
  if (score >= 9 && score <= 15) scoreLabel = 'Ideia promissora, mas precisa refino'
  if (score >= 16) scoreLabel = 'Boa chance de validação real'

  return { score, scoreLabel }
}

export default function App() {
  const initialState = questions.reduce((acc, q) => {
    acc[q.id] = q.type === 'checkbox' ? [] : ''
    return acc
  }, {})

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function handleSelect(name, value, type) {
    if (type === 'checkbox') {
      setForm((prev) => {
        const current = prev[name] || []
        return {
          ...prev,
          [name]: current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value],
        }
      })
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  function handleTextChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { score, scoreLabel } = calcularScore(form)

    const payload = {
      ...form,
      validation_score: score,
      score_label: scoreLabel,
    }

    const { error } = await supabase
      .from('app_validation_responses')
      .insert([payload])

    if (error) {
      setMessage('Erro ao salvar: ' + error.message)
    } else {
      setMessage(`Resposta enviada com sucesso. Score: ${score} - ${scoreLabel}`)
      setForm(initialState)
    }

    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="quiz-container">
      <div className="card">
        <div className="header">
          <h1>Validação do AgroTrack</h1>
          <span className="subtitle">
            Este formulário tem o objetivo de validar a proposta do AgroTrack, um aplicativo
            voltado para a gestão da pecuária de corte. A ideia é reunir em um só lugar
            informações como controle de lotes, custos, ganho de peso, conversão alimentar,
            despesas emergenciais, clima e condição da vegetação/pastagem, ajudando na tomada
            de decisão da operação.
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={q.id} className="question">
              <span className="question-title">
                {index + 1}. {q.label}
              </span>

              {q.type === 'textarea' ? (
                <textarea
                  name={q.id}
                  value={form[q.id]}
                  onChange={handleTextChange}
                  placeholder="Digite sua resposta aqui..."
                  required
                />
              ) : (
                <div className="options-grid">
                  {q.options.map((opt) => {
                    const isSelected =
                      q.type === 'checkbox'
                        ? form[q.id].includes(opt)
                        : form[q.id] === opt

                    return (
                      <label
                        key={opt}
                        className={`option-card ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type={q.type}
                          name={q.id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSelect(q.id, opt, q.type)}
                          style={{ display: 'none' }}
                          required={q.type === 'radio' && !form[q.id]}
                        />
                        <span style={{ textAlign: 'center', lineHeight: '1.4' }}>{opt}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar respostas'}
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}
      </div>
    </div>
  )
}