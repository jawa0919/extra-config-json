/*
 * @FilePath     : /src/extension.ts
 * @Date         : 2022-04-27 11:09:45
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : 启动页
 */

import * as path from "path";
import * as fs from "fs-extra";
import * as os from "os";
import * as vscode from "vscode";

const name = "extra_config_swap";
const defPath = path.join(os.homedir(), `.${name}`);
const historyName = "History";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extra_config_swap" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("extra_config_swap.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from extra_config_swap!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra_config_swap.save", async (...res) => {
      console.log("extra_config_swap.save");
      _saveExtraConfigFile(res[0].fsPath || "");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra_config_swap.swap", (...res) => {
      console.log("extra_config_swap.swap");
      _swapExtraConfigFile(res[0].fsPath || "");
    })
  );
}

function _initRootPath(): string {
  let userPath = vscode.workspace.getConfiguration().get<string>("extra_config_swap.rootPath");
  if (userPath) {
    return userPath;
  }
  fs.ensureDirSync(defPath);
  return defPath;
}

async function _fileNameInputBox(): Promise<string | undefined> {
  let result = await vscode.window.showInputBox({ placeHolder: "Write File Name. eg: gat sdk gz_dev py_test" });
  return result;
}

async function _saveExtraConfigFile(fsPath: string): Promise<void> {
  console.log("_saveExtraConfigFile ~ fsPath", fsPath);
  let rootPath = _initRootPath();
  let name = await _fileNameInputBox();
  if (name) {
    let saveFilePath = path.join(rootPath, `${name}.json`);
    fs.copyFileSync(fsPath, saveFilePath);
  }
}

async function _fileQuickPick(fileList: string[]): Promise<string | undefined> {
  let result = await vscode.window.showQuickPick(fileList);
  return result;
}

async function _swapExtraConfigFile(fsPath: string): Promise<void> {
  console.log("_swapExtraConfigFile ~ fsPath", fsPath);
  let rootPath = _initRootPath();
  let jsonFileList = fs.readdirSync(rootPath).filter((r) => fs.statSync(r).isFile);
  if (jsonFileList.length === 0) {
    vscode.window.showInformationMessage("no find json");
    return;
  }
  let jsonFile = await _fileQuickPick(jsonFileList);
  if (jsonFile) {
    _saveExtraConfigFileHistory(fsPath);
    let jsonFilePath = path.join(rootPath, jsonFile);
    fs.copyFileSync(jsonFilePath, fsPath);
  }
}

function _getTime(): string {
  return new Date().toISOString().substring(0, 19).replace(/[-:T]/g, "");
}

async function _saveExtraConfigFileHistory(fsPath: string): Promise<void> {
  console.log("_saveExtraConfigFileHistory ~ fsPath", fsPath);
  let rootPath = _initRootPath();
  let name = _getTime();
  let historyDirPath = path.join(rootPath, historyName);
  fs.ensureDirSync(historyDirPath);
  let saveFilePath = path.join(historyDirPath, `${name}.json`);
  fs.copyFileSync(fsPath, saveFilePath);
}

export function deactivate() {}
