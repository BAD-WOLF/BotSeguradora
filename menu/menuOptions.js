const createMenu = (text, options = [], questions = []) => ({ text, options, questions });
// Exemplo de estrutura aninhada
const menuOptions = createMenu('Para continuarmos, por favor, selecione a opção que melhor atende às suas necessidades:', [
  createMenu('1️⃣ Seguro auto 🚗', [
    createMenu('Seguro Auto', [
      createMenu('Doação', [], [
        { text: 'Qual é o seu nome?', answer: '' },
        { text: 'Qual é o seu CPF?', answer: '' },
        { text: 'Uma letra, qualquer letra?', answer: '' },
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
  createMenu('2️⃣ Seguro moto 🛵', [
    createMenu('Compra Auto', [], [
      { text: 'Qual é o seu nome?', answer: '' },
      { text: 'Qual é o seu CPF?', answer: '' },
    ]),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu('3️⃣ Plano de saúde 🩺', [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu('4️⃣ Plano dental 🦷', [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu('5️⃣ Plano Pet 🐶 🐱', [
    createMenu('Venda Auto', [], []),
    createMenu('Venda Casa', [], []),
    createMenu('Venda Outros', [], []),
  ]),
  createMenu("6️⃣ Telemedicina 24:00 hrs 📱", [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu("7️⃣ Seguro de Vida 👨‍👨‍👧‍👦", [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu("8️⃣ Previdência Privada 💰", [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu("9️⃣ Consórcio 🏠🚙🚛🏍🚴", [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
  createMenu("🔟 Atendimento humano", [
    createMenu('Compra Auto', [], []),
    createMenu('Compra Casa', [], []),
    createMenu('Compra Outros', [], []),
  ]),
]);

exports.menuOptions = menuOptions;
