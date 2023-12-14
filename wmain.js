const venom = require('venom-bot');

// Função recursiva para lidar com a estrutura aninhada infinitamente
const createMenu = (text, options) => ({ text, options });

// Adicionar mais sub-tópicos conforme necessário (dimensionamento)
const menuOptions = createMenu('Escolha um número para explorar nossos serviços:', [
  createMenu('Seguros', [
    createMenu('Seguro Auto', [
      createMenu('Doação', []),
      createMenu('Opção1', []),
      createMenu('Opção2', []),
      createMenu('Opção3', []),
    ]),
    createMenu('Seguro Moto', []),
    createMenu('Seguro Caminhão', []),
    createMenu('Seguro Vida', []),
    createMenu('Previdência', []),
    createMenu('Consórcio', []),
  ]),
  createMenu('Compra', [
    createMenu('Compra Auto', []),
    createMenu('Compra Casa', []),
    createMenu('Compra Outros', []),
  ]),
  createMenu('Venda', [
    createMenu('Venda Auto', []),
    createMenu('Venda Casa', []),
    createMenu('Venda Outros', []),
  ]),
]);

let currentMenu = menuOptions;
let previousMenus = [];

function sendMenuOptions(client, from, menu) {
  let menuText = `${menu.text}\n${menu.options.map((option, index) => `${index + 1} ~> ${option.text}`).join('\n')}`;
  
  if (previousMenus.length > 0) {
    // Se houver menus anteriores, adiciona a opção de voltar ao menu anterior
    menuText += '\n0 ~> Voltar ao menu anterior';
  }
  
  client.sendText(from, menuText);
}


venom.create(
  //session
  'sessionName', //Pass the name of the client you want to start the bot
  //catchQR
  (base64Qrimg, asciiQR, attempts, urlCode) => {
    // console.log('Number of attempts to read the qrcode: ', attempts);
    // console.log('Terminal qrcode: ', asciiQR);
    // console.log('base64 image string qrcode: ', base64Qrimg);
    // console.log('urlCode (data-ref): ', urlCode);
  },
  // statusFind
  (statusSession, session) => {
    // console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
    // Create session wss return "serverClose" case server for close
    // console.log('Session name: ', session);
  },
  // options
  {
    logQR: true, // Logs QR automatically in terminal
  },

  // BrowserInstance
  (browser, waPage) => {
    console.log('Browser PID:', browser.process().pid);
    waPage.screenshot({ path: 'screenshot/screenshot.png' });
  }
).then((client) => {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      if (message.body == '0' && previousMenus.length > 0) {
        // Usuário escolheu voltar ao tópico anterior
        currentMenu = previousMenus.pop();
        sendMenuOptions(client, message.from, currentMenu);
      } else if (
        message.body == 'oi' ||
        message.body.toLowerCase() === 'bom dia' ||
        message.body.toLowerCase() === 'boa tarde'
      ) {
        // Responde com a mensagem de boas-vindas no chat privado
        sendMenuOptions(client, message.from, currentMenu);
      } else if (
        !message.isGroupMsg &&
        currentMenu.options[message.body - 1] &&
        currentMenu.options[message.body - 1].options
      ) {
        // Usuário escolheu um tópico válido
        previousMenus.push(currentMenu);
        currentMenu = currentMenu.options[message.body - 1];
        sendMenuOptions(client, message.from, currentMenu);
      } else {
        // Mensagem inválida
        client.sendText(message.from, 'Opção inválida. Por favor, escolha um número válido.');
      }
    }
  });
}).catch((err) => {
  console.error(err);
});
