import { useState } from 'react'
import { supabase } from './lib/supabase'

function calcularScore(form) {
  let score = 0

  if (form.works_with_beef === 'Sim') score += 2

  if (['Às vezes', 'Frequentemente', 'Sempre'].includes(form.decision_frequency)) {
    score += 3
  }

  if (['Tenho dificuldade', 'Não consigo saber com segurança'].includes(form.financial_visibility)) {
    score += 3
  }

  if (['Médio impacto', 'Alto impacto', 'Muito alto impacto'].includes(form.financial_impact)) {
    score += 3
  }

  if (['Útil', 'Muito útil'].includes(form.solution_utility)) {
    score += 4
  }

  if (form.would_test === 'Sim') score += 3
  else if (form.would_test === 'Talvez') score += 1

  if (['Todo dia', 'Algumas vezes por semana', 'Uma vez por semana'].includes(form.usage_frequency)) {
    score += 3
  }

  if (form.would_pay === 'Sim') score += 3
  else if (form.would_pay === 'Talvez') score += 1

  let scoreLabel = 'Ideia fraca ou mal posicionada'
  if (score >= 9 && score <= 15) scoreLabel = 'Ideia promissora, mas precisa refino'
  if (score >= 16) scoreLabel = 'Boa chance de validação real'

  return { score, scoreLabel }
}

export default function App() {
  const [form, setForm] = useState({
    works_with_beef: '',
    role: '',
    current_control: [],
    hardest_info: '',
    decision_frequency: '',
    financial_visibility: '',
    financial_impact: '',
    main_difficulty: '',
    solution_utility: '',
    most_valuable_feature: '',
    must_have_features: '',
    would_test: '',
    usage_frequency: '',
    would_pay: '',
    price_range: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      setForm((prev) => {
        const current = prev[name] || []
        return {
          ...prev,
          [name]: checked
            ? [...current, value]
            : current.filter((item) => item !== value),
        }
      })
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
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
      setForm({
        works_with_beef: '',
        role: '',
        current_control: [],
        hardest_info: '',
        decision_frequency: '',
        financial_visibility: '',
        financial_impact: '',
        main_difficulty: '',
        solution_utility: '',
        most_valuable_feature: '',
        must_have_features: '',
        would_test: '',
        usage_frequency: '',
        would_pay: '',
        price_range: '',
      })
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Validação do AgroTrack</h1>
      <p>Formulário para validar a ideia do aplicativo.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>1. Você atua diretamente com pecuária de corte?</label><br />
          <select name="works_with_beef" value={form.works_with_beef} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>

        <br />

        <div>
          <label>2. Qual é sua função principal?</label><br />
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Produtor">Produtor</option>
            <option value="Gerente de fazenda">Gerente de fazenda</option>
            <option value="Técnico / consultor">Técnico / consultor</option>
            <option value="Funcionário operacional">Funcionário operacional</option>
            <option value="Estudante">Estudante</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <br />

        <div>
          <label>3. Hoje, como vocês controlam as informações da operação?</label><br />
          {[
            'Caderno / papel',
            'Planilha',
            'WhatsApp',
            'Aplicativo',
            'Sistema de gestão',
            'Não existe controle organizado',
            'Outro',
          ].map((item) => (
            <div key={item}>
              <label>
                <input
                  type="checkbox"
                  name="current_control"
                  value={item}
                  checked={form.current_control.includes(item)}
                  onChange={handleChange}
                />
                {' '}{item}
              </label>
            </div>
          ))}
        </div>

        <br />

        <div>
          <label>4. Qual dessas informações é mais difícil de acompanhar hoje?</label><br />
          <select name="hardest_info" value={form.hardest_info} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Ganho médio diário (GMD)">Ganho médio diário (GMD)</option>
            <option value="Custo por lote">Custo por lote</option>
            <option value="Custo por animal">Custo por animal</option>
            <option value="Conversão alimentar">Conversão alimentar</option>
            <option value="Consumo de ração / suplemento">Consumo de ração / suplemento</option>
            <option value="Despesas emergenciais">Despesas emergenciais</option>
            <option value="Clima">Clima</option>
            <option value="Vegetação / pastagem">Vegetação / pastagem</option>
            <option value="Outra">Outra</option>
          </select>
        </div>

        <br />

        <div>
          <label>5. Com que frequência a falta de informação organizada atrapalha decisões?</label><br />
          <select name="decision_frequency" value={form.decision_frequency} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Nunca">Nunca</option>
            <option value="Raramente">Raramente</option>
            <option value="Às vezes">Às vezes</option>
            <option value="Frequentemente">Frequentemente</option>
            <option value="Sempre">Sempre</option>
          </select>
        </div>

        <br />

        <div>
          <label>6. Hoje, você consegue saber com facilidade se um lote está dando bom resultado financeiro?</label><br />
          <select name="financial_visibility" value={form.financial_visibility} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Sim, com facilidade">Sim, com facilidade</option>
            <option value="Mais ou menos">Mais ou menos</option>
            <option value="Tenho dificuldade">Tenho dificuldade</option>
            <option value="Não consigo saber com segurança">Não consigo saber com segurança</option>
          </select>
        </div>

        <br />

        <div>
          <label>7. O quanto a falta de controle mais preciso impacta financeiramente a operação?</label><br />
          <select name="financial_impact" value={form.financial_impact} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Nenhum impacto">Nenhum impacto</option>
            <option value="Baixo impacto">Baixo impacto</option>
            <option value="Médio impacto">Médio impacto</option>
            <option value="Alto impacto">Alto impacto</option>
            <option value="Muito alto impacto">Muito alto impacto</option>
          </select>
        </div>

        <br />

        <div>
          <label>8. Qual é a maior dificuldade de gestão hoje na pecuária?</label><br />
          <textarea
            name="main_difficulty"
            value={form.main_difficulty}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <br />

        <div>
          <label>9. Essa solução seria útil para você?</label><br />
          <select name="solution_utility" value={form.solution_utility} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Nada útil">Nada útil</option>
            <option value="Pouco útil">Pouco útil</option>
            <option value="Mais ou menos útil">Mais ou menos útil</option>
            <option value="Útil">Útil</option>
            <option value="Muito útil">Muito útil</option>
          </select>
        </div>

        <br />

        <div>
          <label>10. Qual funcionalidade teria mais valor para você?</label><br />
          <select name="most_valuable_feature" value={form.most_valuable_feature} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Controle de custo por lote">Controle de custo por lote</option>
            <option value="Controle de ganho de peso">Controle de ganho de peso</option>
            <option value="Conversão alimentar">Conversão alimentar</option>
            <option value="Separação por macho e fêmea">Separação por macho e fêmea</option>
            <option value="Clima">Clima</option>
            <option value="Vegetação / pastagem">Vegetação / pastagem</option>
            <option value="Relatórios simples">Relatórios simples</option>
            <option value="Alertas para decisão">Alertas para decisão</option>
            <option value="Outra">Outra</option>
          </select>
        </div>

        <br />

        <div>
          <label>11. Quais funcionalidades não poderiam faltar?</label><br />
          <textarea
            name="must_have_features"
            value={form.must_have_features}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <br />

        <div>
          <label>12. Você testaria uma versão inicial desse aplicativo?</label><br />
          <select name="would_test" value={form.would_test} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Talvez">Talvez</option>
            <option value="Não">Não</option>
          </select>
        </div>

        <br />

        <div>
          <label>13. Com que frequência você acredita que usaria esse aplicativo?</label><br />
          <select name="usage_frequency" value={form.usage_frequency} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Todo dia">Todo dia</option>
            <option value="Algumas vezes por semana">Algumas vezes por semana</option>
            <option value="Uma vez por semana">Uma vez por semana</option>
            <option value="Algumas vezes por mês">Algumas vezes por mês</option>
            <option value="Quase nunca">Quase nunca</option>
          </select>
        </div>

        <br />

        <div>
          <label>14. Você pagaria por uma ferramenta que realmente ajudasse na gestão da operação?</label><br />
          <select name="would_pay" value={form.would_pay} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Talvez">Talvez</option>
            <option value="Não">Não</option>
          </select>
        </div>

        <br />

        <div>
          <label>15. Qual faixa de valor mensal faria sentido para você?</label><br />
          <select name="price_range" value={form.price_range} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Até R$ 29">Até R$ 29</option>
            <option value="De R$ 30 a R$ 59">De R$ 30 a R$ 59</option>
            <option value="De R$ 60 a R$ 99">De R$ 60 a R$ 99</option>
            <option value="Acima de R$ 100">Acima de R$ 100</option>
            <option value="Não pagaria">Não pagaria</option>
            <option value="Depende do que entrega">Depende do que entrega</option>
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar respostas'}
        </button>
      </form>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  )
}