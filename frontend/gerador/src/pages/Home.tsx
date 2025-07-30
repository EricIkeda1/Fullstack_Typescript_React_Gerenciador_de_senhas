import { useState } from 'react';
import '../style/home.css';

export default function Home() {
  // Estados para modo normal (caracteres)
  const [tamanho, setTamanho] = useState<number>(12);
  const [maiusculas, setMaiusculas] = useState<boolean>(true);
  const [minusculas, setMinusculas] = useState<boolean>(true);
  const [numeros, setNumeros] = useState<boolean>(true);
  const [simbolos, setSimbolos] = useState<boolean>(true);

  // Estados para modo palavras
  const [quantidadePalavras, setQuantidadePalavras] = useState<number>(4);
  const [separador, setSeparador] = useState<string>("-");
  const [numerosPalavras, setNumerosPalavras] = useState<boolean>(true);
  const [simbolosPalavras, setSimbolosPalavras] = useState<boolean>(true);

  // Estado geral
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [copiado, setCopiado] = useState<boolean>(false);
  const [forca, setForca] = useState<string>('');
  const [modo, setModo] = useState<'normal' | 'palavras'>('normal'); // Alterna modos

  // Função para gerar senha no modo normal
  async function gerarSenhaNormal(): Promise<void> {
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

  // Função para gerar senha no modo palavras
  async function gerarSenhaPalavras(): Promise<void> {
    if (quantidadePalavras <= 0) {
      setErro('Quantidade de palavras deve ser maior que zero');
      setSenha('');
      return;
    }

    setErro('');
    setLoading(true);
    setCopiado(false);

    const params = new URLSearchParams({
      quantidade: String(quantidadePalavras),
      separar_por: separador,
      numeros: String(numerosPalavras),
      simbolos: String(simbolosPalavras),
    });

    try {
      const response = await fetch(`http://localhost:8080/gerar-palavras?${params.toString()}`);
      const text = await response.text();
      const senhaGerada = text.replace('Senha com palavras: ', '');
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

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            setModo('normal');
            setSenha('');
            setErro('');
            setForca('');
          }}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: modo === 'normal' ? '#6e8efb' : '#ddd',
            color: modo === 'normal' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Modo Normal
        </button>
        <button
          onClick={() => {
            setModo('palavras');
            setSenha('');
            setErro('');
            setForca('');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: modo === 'palavras' ? '#6e8efb' : '#ddd',
            color: modo === 'palavras' ? 'white' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Modo Palavras
        </button>
      </div>

      {modo === 'normal' ? (
        <>
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

          <button onClick={gerarSenhaNormal} disabled={loading} className="buttonGenerate">
            {loading ? 'Gerando...' : '🔄 Gerar Senha'}
          </button>
        </>
      ) : (
        <>
          <div className="slider-group">
            <label className="slider-label">Quantidade de palavras: {quantidadePalavras}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={quantidadePalavras}
              onChange={(e) => setQuantidadePalavras(Number(e.target.value))}
              className="rangeInput"
              style={{ '--progress': `${((quantidadePalavras - 1) / 9) * 100}%` } as React.CSSProperties}
            />
          </div>

          <div className="options" style={{ justifyContent: 'center' }}>
            <label className="checkboxLabel" style={{ width: '100%' }}>
              Separador:{' '}
              <input
                type="text"
                maxLength={3}
                value={separador}
                onChange={(e) => setSeparador(e.target.value)}
                style={{ width: '50px', textAlign: 'center' }}
              />
            </label>

            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={numerosPalavras}
                onChange={(e) => setNumerosPalavras(e.target.checked)}
              />{' '}
              Adicionar números
            </label>

            <label className="checkboxLabel">
              <input
                type="checkbox"
                checked={simbolosPalavras}
                onChange={(e) => setSimbolosPalavras(e.target.checked)}
              />{' '}
              Adicionar símbolos
            </label>
          </div>

          <button onClick={gerarSenhaPalavras} disabled={loading} className="buttonGenerate">
            {loading ? 'Gerando...' : '🔄 Gerar Senha com Palavras'}
          </button>
        </>
      )}

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
