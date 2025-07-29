# 🔐 Gerador de Senhas - Rust + React

Um gerador de senhas seguro e customizável com frontend moderno em **React + Vite** e backend robusto em **Rust (Actix Web)**.

Permite criar senhas aleatórias com letras maiúsculas, minúsculas, números e símbolos, com comprimento personalizável via interface.

---

## 🚀 Funcionalidades

- Geração de senhas aleatórias seguras
- Opções de configuração:
  - Tamanho da senha
  - Inclusão de maiúsculas, minúsculas, números e símbolos
- Interface web responsiva
- Integração entre frontend e backend via HTTP (CORS habilitado)

---

## 📁 Estrutura do Projeto

```
Gerador_De_Senhas_Rust/
├── backend/ # Servidor Rust com Actix Web
│ └── src/
│ └── main.rs
│ └── Cargo.toml
├── frontend/ # Aplicação React + Vite
│ ├── src/
│ └── index.html
│ └── vite.config.ts
```

---

## ✅ Pré-requisitos

- [Rust](https://www.rust-lang.org/tools/install) instalado
- [Node.js](https://nodejs.org) + [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Visual Studio com C++ Build Tools (para compilar o backend no Windows)

---

## 🔧 Como rodar o projeto

### 📦 1. Inicie o backend (Rust + Actix Web)
```
cd backend
```
```
cargo run
```

# O servidor estará disponível em: http://localhost:8080

🌐 2. Inicie o frontend (React + Vite)

cd frontend
npm install   # ou yarn
npm run dev   # ou yarn dev
A interface será aberta em: http://localhost:5173

🔁 Comunicação entre Frontend e Backend
O frontend se conecta com o backend através da rota:

GET http://localhost:8080/gerar?tamanho=12&maiusculas=true&minusculas=true&numeros=true&simbolos=true

Senha gerada: s3nh@Segura!

# Tecnologias utilizadas
Backend (Rust)
Actix Web

Actix CORS

Rand

Serde

Frontend (React)
React + Vite

TypeScript

Fetch API
