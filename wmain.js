const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const venom = require('venom-bot');
const { menuOptions } = require("./menu/menuOptions");

const QUESTIONS_FOLDER = 'questions'; // Nome da pasta para armazenar os arquivos YAML

let currentMenu = menuOptions;
let previousMenus = [];
let currentQuestions = [];
let userAnswers = {}; // Armazena as respostas do usuário
let menuInitialized = false;

// Função para enviar opções de menu ou perguntas ao usuário
function sendOptionsOrQuestion(client, from, welcomeMessage = false) {
  const sendWelcomeMessage = () => {
    if (welcomeMessage) {
      const welcomeText = "Olá! Sou o Sérgio Neres, consultor de seguros e especialista em proteção financeira e familiar. Seja bem-vindo! Estou aqui para ajudar a garantir a segurança e tranquilidade para você e sua família.";
      return client.sendText(from, welcomeText);
    }
    return Promise.resolve();
  };

  const sendMenuOrQuestion = () => {
    if (currentQuestions.length > 0) {
      const currentQuestion = currentQuestions[0];
      return client.sendText(from, currentQuestion.text);
    }

    let menuText = `${currentMenu.text}\n${currentMenu.options.map((option, index) => `${index + 1} ~> ${option.text}`).join('\n')}`;

    if (previousMenus.length > 0) {
      menuText += '\n0 ~> Voltar ao menu anterior';
    }

    return client.sendText(from, menuText);
  };

  return sendWelcomeMessage().then(sendMenuOrQuestion);
}

// Função para criar um arquivo YAML com as respostas do usuário
function writeUserAnswersToFile(userId, topic, answers) {
  try {
    const userFolder = path.join(QUESTIONS_FOLDER, userId);
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    const fileName = path.join(userFolder, `${topic.replace(/\s/g, '_')}.yaml`);
    const yamlData = yaml.dump(answers);
    fs.writeFileSync(fileName, yamlData, 'utf8');
    console.log(`Arquivo ${fileName} criado/atualizado com sucesso!`);
  } catch (error) {
    console.error(`Erro ao criar/atualizar o arquivo ${fileName}:`, error);
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
      const userId = message.from;
      if (!menuInitialized) {
        menuInitialized = true;
        sendOptionsOrQuestion(client, userId, true);
      } else if (message.body === '0' && previousMenus.length > 0) {
        currentMenu = previousMenus.pop();
        sendOptionsOrQuestion(client, userId);
      } else if (currentQuestions.length > 0) {
        const currentQuestion = currentQuestions.shift();
        currentQuestion.answer = message.body;

        if (currentQuestions.length > 0) {
          sendOptionsOrQuestion(client, userId);
        } else {
          if (!userAnswers[userId]) {
            userAnswers[userId] = {};
          }

          userAnswers[userId][currentMenu.text] = currentMenu.questions.reduce((acc, question) => {
            acc[question.text] = question.answer;
            return acc;
          }, {});

          writeUserAnswersToFile(userId, currentMenu.text, userAnswers[userId][currentMenu.text]);

          currentMenu = previousMenus.pop();
          sendOptionsOrQuestion(client, userId);

          console.log('Respostas do Usuário:', userAnswers);
        }
      } else if (currentMenu.options[message.body - 1]) {
        previousMenus.push(currentMenu);
        currentMenu = currentMenu.options[message.body - 1];
        currentQuestions = currentMenu.questions.slice();
        sendOptionsOrQuestion(client, userId);
      } else {
        client.sendText(userId, 'Opção inválida. Por favor, escolha um número válido.');
      }
    }
  });
}).catch((err) => {
  console.error(err);
});
