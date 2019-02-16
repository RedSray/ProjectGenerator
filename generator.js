#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const replaceInFiles = require('replace-in-files');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if(/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
  .then(answers => {
    const projectChoice = answers['project-choice'];
    const projectName = answers['project-name'];
    const templatePath = `${__dirname}/templates/${projectChoice}`;

    fs.mkdirSync(`${CURR_DIR}/${projectName}`);

    const files = createDirectoryContents(templatePath, projectName);
    console.log(files)
    const options = {
      files: files,

      from: /%&projectname&%/g,  // string or regex
      to: `${projectName}`
    }

    replaceInFiles(options)
      .then(({ changedFiles, countOfMatchesByPaths }) => {
        console.log(countOfMatchesByPaths);
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  });

function createDirectoryContents (templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);
  var files = Array();

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if(stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
      files.push(writePath);
    } else if(stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      // recursive call
      var subfiles = createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
      files = files.concat(subfiles);
    }
  });

  return files
}