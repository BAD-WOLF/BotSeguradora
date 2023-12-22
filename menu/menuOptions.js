const createMenu = (text, options = [], questions = [], text_after) => ({ text, options, questions, text_after });

const welcome = "Seja bem-vindo ao nosso serviço de delivery! Estamos animados em ter você conosco.";

const deliveryMenu = createMenu('Bem-vindo ao nosso serviço de entrega! Como posso ajudar você hoje?', [
  createMenu('1️⃣ Fazer um Pedido 🍕', [
    createMenu('Pizza', [], [
      { text: 'Qual sabor de pizza você deseja?', answer: '' },
      { text: 'Tamanho (P, M, G)?', answer: '' },
      { text: 'Alguma observação especial?', answer: '' },
    ], "seu pedido foi anotado!! ✅"),
    createMenu('Hamburguer', [], [
      { text: 'Qual tipo de hambúrguer você deseja?', answer: '' },
      { text: 'Acompanhamentos desejados?', answer: '' },
    ]),
    createMenu('Sushi', [], [
      { text: 'Combo ou peças avulsas?', answer: '' },
      { text: 'Alguma restrição alimentar?', answer: '' },
    ]),
  ]),
  createMenu('2️⃣ Rastrear Pedido 🚚', [
    createMenu('Digite o código de rastreamento:', [], [
      { text: 'Código de rastreamento', answer: '' },
    ]),
  ]),
  createMenu('3️⃣ Informações sobre Entrega 🕒', [
    createMenu('Verificar Status de Entrega', [], [
      { text: 'Número do Pedido', answer: '' },
    ]),
    createMenu('Alterar Endereço de Entrega', [], [
      { text: 'Novo Endereço', answer: '' },
    ]),
    createMenu('Dúvidas sobre Prazo de Entrega', [], []),
  ]),
  createMenu('4️⃣ Suporte ao Cliente 📞', [
    createMenu('Falar com um Atendente', [], []),
    createMenu('Relatar Problema com Pedido', [], [
      { text: 'Descreva o problema', answer: '' },
    ]),
    createMenu('Outras Questões', [], []),
  ]),
  createMenu('5️⃣ Promoções e Descontos 🎉', [
    createMenu('Ofertas do Dia', [], []),
    createMenu('Cupons Disponíveis', [], []),
  ]),
]);

exports.menuOptions = deliveryMenu;
exports.welcome = welcome;