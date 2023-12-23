const fs = require('fs');
const yaml = require('js-yaml');
const path = require("path");
const sep = path.sep;
const { menuOptions } = require("."+sep+"menu"+sep+"menuOptions");

// CONVERTA SEU JSON FEITO PELA FUNÇÃO "createMenu" AQUI

// Seu objeto JSON
const jsonObj = menuOptions;

// Convertendo JSON para YAML
const yamlString = yaml.dump(jsonObj);

// Especificando o caminho do arquivo onde você deseja salvar o YAML
const filePath = path.join("menu", "menuOptions.yaml");

// Escrevendo o YAML no arquivo
fs.writeFileSync(filePath, yamlString, 'utf-8');

console.log(`O objeto JSON foi convertido para YAML e salvo em ${filePath}`);
