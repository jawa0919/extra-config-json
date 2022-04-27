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
import * as child_process from "child_process";

const defPath = path.join(os.homedir(), ".extra-config-json");
const historyName = "History";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extra-config-json" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("extra-config-json.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from extra-config-json!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra-config-json.save", async (...res) => {
      console.log("extra-config-json.save");
      _saveExtraConfigFile(res[0].fsPath || "");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra-config-json.swap", (...res) => {
      console.log("extra-config-json.swap");
      _swapExtraConfigFile(res[0].fsPath || "");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra-config-json.git.assume.unchanged", (...res) => {
      console.log("extra-config-json.git.assume.unchanged");
      let fsPath: string = res[0].fsPath || "";
      if (fsPath) {
        // let cmd = "git update-index --assume-unchanged " + fsPath;
        let workspaceFolder = vscode.workspace.workspaceFolders?.find((r) => fsPath.startsWith(r.uri.fsPath));
        let cwd = workspaceFolder?.uri.fsPath;
        child_process.execFileSync("git", ["update-index", "--assume-unchanged", fsPath], { cwd });
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extra-config-json.git.no.assume.unchanged", (...res) => {
      console.log("extra-config-json.git.no.assume.unchanged");
      let fsPath = res[0].fsPath || "";
      if (fsPath) {
        // let cmd = "git update-index --no-assume-unchanged " + fsPath;
        let workspaceFolder = vscode.workspace.workspaceFolders?.find((r) => fsPath.startsWith(r.uri.fsPath));
        let cwd = workspaceFolder?.uri.fsPath;
        child_process.execFileSync("git", ["update-index", "--no-assume-unchanged", fsPath], { cwd });
      }
    })
  );
}

function _initRootPath(): string {
  let dirPath = vscode.workspace.getConfiguration().get<string>("extra-config-json.dirPath");
  if (dirPath) {
    fs.ensureDirSync(dirPath);
    return dirPath;
  }
  fs.ensureDirSync(defPath);
  return defPath;
}

function _findFileTextDocument(fsPath: string): vscode.TextDocument | undefined {
  console.log("_findFileTextDocument");
  return vscode.workspace.textDocuments.find((doc) => doc.uri.fsPath === fsPath);
}

async function _fileNameInputBox(): Promise<string | undefined> {
  let result = await vscode.window.showInputBox({ placeHolder: "Write File Name. eg: gat sdk gz_dev py_test" });
  return result;
}

async function _saveExtraConfigFile(fsPath: string): Promise<void> {
  console.log("_saveExtraConfigFile ~ fsPath", fsPath);
  let textDocument = _findFileTextDocument(fsPath);
  await textDocument?.save();
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
  let textDocument = _findFileTextDocument(fsPath);
  if (textDocument?.isDirty) {
    vscode.window.showErrorMessage("请先 Ctrl+s 保存文件");
    return;
  }
  let rootPath = _initRootPath();
  let jsonFileList = fs.readdirSync(rootPath).filter((name) => {
    return name.endsWith(".json");
  });
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
