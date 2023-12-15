const createMenu = (text, options = [], questions = []) => ({ text, options, questions });
// Exemplo de estrutura aninhada
const menuOptions = createMenu('Escolha um número para explorar nossos serviços:', [
  createMenu('Seguros', [
    createMenu('Seguro Auto', [
      createMenu('Doação', [], [
        { text: 'Qual é o seu nome?', answer: '' },
        { text: 'Qual é o seu CPF?', answer: '' },
        // Adicione mais perguntas conforme necessário
      ]),
      createMenu('Opção1', [], []),
      createMenu('Opção2', [], []),
      createMenu('Opção3', [], []),
    ]),
    createMenu('Seguro Moto', [], [
      { text: "nome?", answer: '' },
      { text: "cpf?", answer: '' }
    ]),
    createMenu('Seguro Caminhão', [], []),
    createMenu('Seguro Vida', [], []),
    createMenu('Previdência', [], []),
    createMenu('Consórcio', [], []),
  ]),
  createMenu('Compra', [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu('Venda', [
    createMenu('Venda Auto', [], []),
    createMenu('Venda Casa', [], []),
    createMenu('Venda Outros', [], []),
  ]),
]);

exports.menuOptions = menuOptions;
