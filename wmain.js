const venom = require('venom-bot');
const { menuOptions } = require("./menu/menuOptions");

let currentMenu = menuOptions;
let previousMenus = [];
let currentQuestions = [];
let userAnswers = {}; // Armazena as respostas do usuário
let menuInitialized = false;

// Função para enviar opções de menu ou perguntas ao usuário
function sendOptionsOrQuestion(client, from) {
  if (currentQuestions.length > 0) {
    // Se houver perguntas, envia a próxima pergunta
    const currentQuestion = currentQuestions[0];
    client.sendText(from, currentQuestion.text);
  } else {
    // Se não houver perguntas, envia as opções de menu
    let menuText = `${currentMenu.text}\n${currentMenu.options.map((option, index) => `${index + 1} ~> ${option.text}`).join('\n')}`;

    // Se houver menus anteriores, adiciona a opção de voltar ao menu anterior
    if (previousMenus.length > 0) {
      menuText += '\n0 ~> Voltar ao menu anterior';
    }

    client.sendText(from, menuText);
  }
}

venom.create(
  'sessionName',
  (base64Qrimg, asciiQR, attempts, urlCode) => {},
  (statusSession, session) => {},
  {
    logQR: true,
  },
  (browser, waPage) => {
    console.log('Browser PID:', browser.process().pid);
    waPage.screenshot({ path: 'screenshot/screenshot.png' });
  }
).then((client) => {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      if (!menuInitialized) {
        // Se não houver menu inicializado, envia o menu principal
        menuInitialized = true;
        sendOptionsOrQuestion(client, message.from);
      } else if (message.body === '0' && previousMenus.length > 0) {
        // Usuário escolheu voltar ao menu anterior
        currentMenu = previousMenus.pop();
        sendOptionsOrQuestion(client, message.from);
      } else if (currentQuestions.length > 0) {
        // Se há perguntas, salva a resposta do usuário e envia a próxima pergunta
        const currentQuestion = currentQuestions.shift();
        currentQuestion.answer = message.body;

        if (currentQuestions.length > 0) {
          sendOptionsOrQuestion(client, message.from);
        } else {
          // Se não houver mais perguntas, armazena as respostas do usuário
          userAnswers[currentMenu.text] = currentMenu.questions.reduce((acc, question) => {
            acc[question.text] = question.answer;
            return acc;
          }, {});

          // Retorna ao menu anterior
          currentMenu = previousMenus.pop();
          sendOptionsOrQuestion(client, message.from);

          // Exibe o objeto com as respostas do usuário apenas quando todas as perguntas foram respondidas
          console.log('Respostas do Usuário:', userAnswers);
        }
      } else if (currentMenu.options[message.body - 1]) {
        // Usuário escolheu um tópico válido
        previousMenus.push(currentMenu);
        currentMenu = currentMenu.options[message.body - 1];
        currentQuestions = currentMenu.questions.slice(); // Copia as perguntas do menu
        sendOptionsOrQuestion(client, message.from);
      } else {
        // Mensagem inválida
        client.sendText(message.from, 'Opção inválida. Por favor, escolha um número válido.');
      }
    }
  });
}).catch((err) => {
  console.error(err);
});
