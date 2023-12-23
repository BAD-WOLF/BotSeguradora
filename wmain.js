const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
// Obtendo o separador de caminho como uma string
const sep  = path.sep;
const { welcome } = require("."+sep+"menu"+sep+"menuOptions");
// Pode fazer um menu personalizado com JSON tambem (descomente a linha abaixo):
// const { menuOptions } = require("."+sep+"menu"+sep+"menuOptions");

// Especificando o caminho do arquivo YAML
const filePath = path.join('menu', 'menuOptions.yaml');

// Lendo o conteúdo do arquivo YAML
const yamlString = fs.readFileSync(filePath, 'utf-8');

// Convertendo YAML para JSON
const menuOptions = yaml.load(yamlString);

const QUESTIONS_FOLDER = 'questions';

let currentMenu = menuOptions;
let previousMenus = [];
let currentQuestions = [];
let userAnswers = {}; // Armazena as respostas do usuário
let menuInitialized = false;

// Cria a pasta 'questions' se ela não existir
if (!fs.existsSync(QUESTIONS_FOLDER)) {
  fs.mkdirSync(QUESTIONS_FOLDER);
}

// Função para criar a pasta do usuário se ela não existir
function createUserFolder(userId) {
  const userFolderPath = path.join(QUESTIONS_FOLDER, userId);
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }
}

// Função para enviar opções de menu ou perguntas ao usuário
function sendOptionsOrQuestion(client, from, welcomeMessage = false) {
  const sendWelcomeMessage = () => {
    if (welcomeMessage) {
      const welcomeText = welcome;
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
function writeUserAnswersToFile(userId, fileName, answers) {
  try {
    const filePath = path.join(QUESTIONS_FOLDER, userId, fileName);
    const yamlData = yaml.dump(answers);
    fs.writeFileSync(filePath, yamlData, 'utf8');
    console.log(`Arquivo ${filePath} criado/atualizado com sucesso!`);
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
    waPage.screenshot({ path: path.join('screenshot', 'screenshot.png') });
  }
).then((client) => {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      const userId = message.from;
      createUserFolder(userId); // Cria a pasta do usuário
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

          // Exibe a opção de salvar ou refazer
          client.sendText(userId, '1 ~> Salvar\n2 ~> Refazer');
        }
      } else if (currentMenu.options[message.body - 1]) {
        previousMenus.push(currentMenu);
        currentMenu = currentMenu.options[message.body - 1];
        currentQuestions = currentMenu.questions.slice();
        sendOptionsOrQuestion(client, userId);
      } else if (message.body === '1') {
        // Usuário escolheu salvar
        // Implemente aqui o código para lidar com a opção de salvar
        const fileName = `${currentMenu.text.replace(/\s/g, '_')}.yaml`;
        writeUserAnswersToFile(userId, fileName, userAnswers[userId][currentMenu.text]);
        // Se houver uma mensagem para exibir após salvar, envia aqui
        if (currentMenu.text_after) {
          await client.sendText(userId, currentMenu.text_after);
        }


        // Reinicia o menu
        currentMenu = menuOptions;
        previousMenus = [];
        currentQuestions = [];
        userAnswers = {};
        sendOptionsOrQuestion(client, userId);
      } else if (message.body === '2') {
        // Usuário escolheu refazer
        // Reinicia o menu
        currentMenu = menuOptions;
        previousMenus = [];
        currentQuestions = [];
        userAnswers = {};
        sendOptionsOrQuestion(client, userId);
      } else {
        client.sendText(userId, 'Opção inválida. Por favor, escolha um número válido.');
      }
    }
  });
}).catch((err) => {
  console.error(err);
});
