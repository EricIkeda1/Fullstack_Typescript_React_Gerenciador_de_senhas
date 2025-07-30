import { useState } from 'react';
import '../style/home.css';

export default function Home() {
  const [tamanho, setTamanho] = useState<number>(12);
  const [maiusculas, setMaiusculas] = useState<boolean>(true);
  const [minusculas, setMinusculas] = useState<boolean>(true);
  const [numeros, setNumeros] = useState<boolean>(true);
  const [simbolos, setSimbolos] = useState<boolean>(true);
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [copiado, setCopiado] = useState<boolean>(false);
  const [forca, setForca] = useState<string>('');

  async function gerarSenha(): Promise<void> {
    if (!maiusculas && !minusculas && !numeros && !simbolos) {
      setErro('Selecione pelo menos um tipo de caractere');
      setSenha('');
      return;
    }

    setErro('');
    setLoading(true);
    setCopiado(false);

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
      const senhaGerada = text.replace('Senha gerada: ', '');
      setSenha(senhaGerada);
      setForca(analisarForca(senhaGerada));
    } catch {
      setErro('Erro ao conectar com o servidor');
      setSenha('');
    } finally {
      setLoading(false);
    }
  }

  function copiarSenha(): void {
    navigator.clipboard.writeText(senha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function analisarForca(s: string): string {
    let pontuacao = 0;
    if (s.length >= 8) pontuacao++;
    if (/[A-Z]/.test(s)) pontuacao++;
    if (/[a-z]/.test(s)) pontuacao++;
    if (/\d/.test(s)) pontuacao++;
    if (/[^A-Za-z0-9]/.test(s)) pontuacao++;

    if (pontuacao <= 2) return 'Fraca';
    if (pontuacao === 3 || pontuacao === 4) return 'Média';
    return 'Forte';
  }

  return (
    <div className="container">
      <h1 className="title">🔐 Gerador de Senhas</h1>

      <div className="slider-group">
        <label className="slider-label">Tamanho: {tamanho}</label>
        <input
          type="range"
          min={4}
          max={64}
          value={tamanho}
          onChange={(e) => setTamanho(Number(e.target.value))}
          className="rangeInput"
          style={{ '--progress': `${((tamanho - 4) / 60) * 100}%` } as React.CSSProperties}
        />
      </div>

      <div className="options">
        {[
          { label: 'Maiúsculas', checked: maiusculas, setter: setMaiusculas },
          { label: 'Minúsculas', checked: minusculas, setter: setMinusculas },
          { label: 'Números', checked: numeros, setter: setNumeros },
          { label: 'Símbolos', checked: simbolos, setter: setSimbolos },
        ].map(({ label, checked, setter }) => (
          <label key={label} className="checkboxLabel">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
            />{' '}
            {label}
          </label>
        ))}
      </div>

      <button onClick={gerarSenha} disabled={loading} className="buttonGenerate">
        {loading ? 'Gerando...' : '🔄 Gerar Senha'}
      </button>

      {erro && <p className="errorText">{erro}</p>}

      {senha && !erro && (
        <>
          <div className="passwordResult">
            <span>
              <strong>Senha:</strong> {senha}
            </span>
            <button className="copyButton" onClick={copiarSenha}>
              {copiado ? '✔️ Copiado!' : '📋 Copiar'}
            </button>
          </div>

          <div className={`passwordStrength ${forca.toLowerCase()}`}>
            Força da Senha: <strong>{forca}</strong>
          </div>
        </>
      )}
    </div>
  );
}
