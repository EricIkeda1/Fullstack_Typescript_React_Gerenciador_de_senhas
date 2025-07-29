use rand::Rng;
use clap::Parser;

#[derive(Parser)]
#[command(author, version, about)]
struct Args {
    #[arg(short, long, default_value_t = 12)]
    tamanho: usize,

    #[arg(short = 'u', long, default_value_t = true)]
    maiusculas: bool,

    #[arg(short = 'l', long, default_value_t = true)]
    minusculas: bool,

    #[arg(short = 'n', long, default_value_t = true)]
    numeros: bool,

    #[arg(short = 's', long, default_value_t = true)]
    simbolos: bool,
}

fn main() {
    let args = Args::parse();

    let mut charset = String::new();

    if args.maiusculas {
        charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if args.minusculas {
        charset.push_str("abcdefghijklmnopqrstuvwxyz");
    }
    if args.numeros {
        charset.push_str("0123456789");
    }
    if args.simbolos {
        charset.push_str("!@#$%&*()_+-=");
    }

    if charset.is_empty() {
        eprintln!("Nenhuma opção selecionada. Selecione pelo menos um tipo de caractere.");
        std::process::exit(1);
    }

    let senha: String = (0..args.tamanho)
        .map(|_| {
            let idx = rand::thread_rng().gen_range(0..charset.len());
            charset.chars().nth(idx).unwrap()
        })
        .collect();

    println!("Sua senha gerada: {senha}");
}
