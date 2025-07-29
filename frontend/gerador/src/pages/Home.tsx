import { useState } from 'react';
import '../style/home.css';

export default function Home() {
  const [tamanho, setTamanho] = useState(12);
  const [maiusculas, setMaiusculas] = useState(true);
  const [minusculas, setMinusculas] = useState(true);
  const [numeros, setNumeros] = useState(true);
  const [simbolos, setSimbolos] = useState(true);
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function gerarSenha() {
    if (!maiusculas && !minusculas && !numeros && !simbolos) {
      setErro('Selecione pelo menos um tipo de caractere');
      setSenha('');
      return;
    }

    setErro('');
    setLoading(true);

    const params = new URLSearchParams({
      tamanho: String(tamanho),
      maiusculas: String(maiusculas),
      minusculas: String(minusculas),
      numeros: String(numeros),
      simbolos: String(simbolos),
    });

    try {
      const response = await fetch(`http://localhost:8080/gerar?${params.toString()}`);
      const text = await response.text();
      setSenha(text.replace('Senha gerada: ', ''));
    } catch {
      setErro('Erro ao conectar com o servidor');
      setSenha('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">🔒 Gerador de Senhas</h1>

      <label>
        Tamanho: {tamanho}
        <input
          type="range"
          min={4}
          max={64}
          value={tamanho}
          onChange={e => setTamanho(Number(e.target.value))}
          className="rangeInput"
        />
      </label>

      <div className="options">
        <label>
          <input
            type="checkbox"
            checked={maiusculas}
            onChange={e => setMaiusculas(e.target.checked)}
          /> Maiúsculas
        </label>

        <label>
          <input
            type="checkbox"
            checked={minusculas}
            onChange={e => setMinusculas(e.target.checked)}
          /> Minúsculas
        </label>

        <label>
          <input
            type="checkbox"
            checked={numeros}
            onChange={e => setNumeros(e.target.checked)}
          /> Números
        </label>

        <label>
          <input
            type="checkbox"
            checked={simbolos}
            onChange={e => setSimbolos(e.target.checked)}
          /> Símbolos
        </label>
      </div>

      <button onClick={gerarSenha} disabled={loading} className="buttonGenerate">
        {loading ? 'Gerando...' : 'Gerar Senha'}
      </button>

      {erro && <p className="errorText">{erro}</p>}

      {senha && !erro && (
        <div className="passwordResult">
          <strong>Senha:</strong> {senha}
        </div>
      )}
    </div>
  );
}
