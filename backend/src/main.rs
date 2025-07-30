use actix_cors::Cors;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, http::header};
use serde::Deserialize;
use rand::seq::SliceRandom;
use rand::Rng;

#[derive(Deserialize)]
struct Parametros {
    tamanho: usize,
    maiusculas: bool,
    minusculas: bool,
    numeros: bool,
    simbolos: bool,
}

#[derive(Deserialize)]
struct ParamPalavras {
    quantidade: usize,
    separar_por: Option<String>,
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
        return HttpResponse::BadRequest().body("Erro: Nenhum tipo de caractere selecionado.");
    }

    let chars: Vec<char> = charset.chars().collect();
    let mut rng = rand::thread_rng();

    let senha: String = (0..query.tamanho)
        .map(|_| *chars.choose(&mut rng).unwrap())
        .collect();

    HttpResponse::Ok().body(format!("Senha gerada: {}", senha))
}

#[get("/gerar-palavras")]
async fn gerar_senha_palavras(query: web::Query<ParamPalavras>) -> impl Responder {
    let palavras = vec![
        "sol", "lua", "mar", "flor", "casa", "vento", "fogo", "rio", "paz", "mel",
        "amor", "terra", "estrela", "coração", "luz", "céu", "noite", "dia",
        "montanha", "valle", "oceano", "brisa", "neve", "festa", "fada", "planeta",
        "tempo", "vida", "sombra", "raio", "fumaça", "farol", "barco", "madeira",
        "pedra", "areia", "nuvem", "raiz", "folha", "pássaro", "ferrugem", "maré",
        "árvore", "lago", "fagulha", "neblina", "braço", "coral", "sal", "amanhecer",
        "musgo", "orvalho", "gelo", "campo", "bússola", "relâmpago", "sereia",
        "dragão", "vulcão", "planície", "praia", "floresta", "ilha", "deserto",
        "oásis", "caverna", "cascata", "ninho",

        "gato", "cachorro", "coelho", "hamster", "papagaio", "canário", "peixe",
        "cavalo", "porquinho", "tartaruga", "periquito",

        "leão", "tigre", "urso", "lobo", "raposa", "coruja", "águia", "falcão",
        "elefante", "rinoceronte", "hipopótamo", "girafa", "zebra", "canguru",
        "onça", "jacaré", "cobra", "tatu", "morcego", "golfinho", "baleia", "tubarão",
        "cervo", "veado", "pinguim", "guaxinim", "orangotango", "chimpanzé",
        "crocodilo", "javali", "búfalo", "antílope", "pardal", "corvo", "pardal",
        "andorinha", "gaivota", "flamingo", "papagaio", "tucano", "pavão",
    ];

    if query.quantidade == 0 {
        return HttpResponse::BadRequest().body("Quantidade deve ser maior que zero");
    }

    let separador = query.separar_por.clone().unwrap_or_else(|| "-".to_string());
    let mut rng = rand::thread_rng();

    let escolhidas: Vec<String> = (0..query.quantidade)
        .map(|_| palavras.choose(&mut rng).unwrap().to_string())
        .collect();

    let mut senha = escolhidas.join(&separador);

    if query.numeros {
        let num: u32 = rng.gen_range(10..1000);
        senha.push_str(&num.to_string());
    }

    if query.simbolos {
        let simbolos = "!@#$%&*()_+-=";
        let simbolos_chars: Vec<char> = simbolos.chars().collect();
        let simb = simbolos_chars.choose(&mut rng).unwrap();
        senha.push(*simb);
    }

    HttpResponse::Ok().body(format!("Senha com palavras: {}", senha))
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
            .service(gerar_senha_palavras)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
