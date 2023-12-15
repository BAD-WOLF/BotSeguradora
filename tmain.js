const { Telegraf } = require('telegraf');
const fs = require('fs');

const token = fs.readFileSync("token.key", "utf-8").trim();
const bot = new Telegraf(token);

// Defina um estado inicial
const initialState = {};

// Comando /start
bot.start((ctx) => {
  ctx.reply('Olá! Bem-vindo à Sergio Neres corretora de seguros. Para continuar, e saber quais são os seguros que oferecemos digite /seguros');
});

// Comando para a opção 'seguros'
bot.command('seguros', (ctx) => {
  ctx.reply('Escolha uma opção de seguros:', {
    reply_markup: {
      keyboard: [
        ['Seguro Auto', 'Seguro Moto', 'Seguro Caminhão'],
        ['Seguro Vida', 'Previdência', 'Consórcio'],
        ['Plano de Saúde', 'Seguros Odonto', 'Seguros para Pet'],
        ['Financiamento', 'Cartão de Crédito']
      ],
      one_time_keyboard: true,
    },
  });
});

// Resposta para as opções de seguros
bot.hears(['Seguro Auto', 'Seguro Moto', 'Seguro Caminhão'], (ctx) => {
  ctx.reply('Para dar continuidade ao cálculo do seu seguro, digite os dados abaixo:');
  // Aqui você pode iniciar um questionário usando o estado do bot para armazenar as respostas
  // Exemplo: initialState.step = 'seguro_auto';
});

// Adicione mais ouvintes para outras opções...

// Inicie o bot
bot.launch();

