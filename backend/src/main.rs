use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer, Responder, http::header};
use serde::Deserialize;
use rand::Rng;

#[derive(Deserialize)]
struct Parametros {
    tamanho: usize,
    maiusculas: bool,
    minusculas: bool,
    numeros: bool,
    simbolos: bool,
}

#[get("/gerar")]
async fn gerar_senha(query: web::Query<Parametros>) -> impl Responder {
    let mut charset = String::new();

    if query.maiusculas {
        charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if query.minusculas {
        charset.push_str("abcdefghijklmnopqrstuvwxyz");
    }
    if query.numeros {
        charset.push_str("0123456789");
    }
    if query.simbolos {
        charset.push_str("!@#$%&*()_+-=");
    }

    if charset.is_empty() {
        return "Erro: Nenhum tipo de caractere selecionado.".to_string();
    }

    let senha: String = (0..query.tamanho)
        .map(|_| {
            let idx = rand::thread_rng().gen_range(0..charset.len());
            charset.chars().nth(idx).unwrap()
        })
        .collect();

    format!("Senha gerada: {senha}")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Servidor rodando em http://localhost:8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173") 
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allowed_headers(vec![header::CONTENT_TYPE, header::ACCEPT])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(gerar_senha)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
