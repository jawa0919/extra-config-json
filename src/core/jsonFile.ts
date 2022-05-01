/*
 * @FilePath     : /src/core/jsonFile.ts
 * @Date         : 2022-04-30 20:37:09
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : json文件处理
 */

import { execFileSync } from "child_process";
import { copyFileSync, ensureDirSync, readdirSync, readJsonSync, writeFileSync } from "fs-extra";
import { join } from "path";
import { commands } from "vscode";
import { dirPath, envLocalNameList, historyDirName } from "./config";
import { addScriptInPkg, loadPkgData, reactField, vueField } from "./pkgFile";
import {
  findTextDocument,
  showErrorMessage,
  showInformationMessage,
  showInputBox,
  showQuickPick,
  dateTimeName,
  findWorkspaceFolder,
  jsonAnyToString,
} from "./util";
import { NormalizedPackageJson, PackageJson } from "read-pkg-up";

export const jsonFileCMD = [
  commands.registerCommand("extra-config-json.json.save", _jsonSave),
  commands.registerCommand("extra-config-json.json.swap", _jsonSwap),
  commands.registerCommand("extra-config-json.json.to.env", _jsonToEnv),
  commands.registerCommand("extra-config-json.json.git.assume", _jsonGitAssume),
  commands.registerCommand("extra-config-json.json.git.no.assume", _jsonGitNoAssume),
];

async function _jsonSave(...res: any[]) {
  console.log("_jsonSave");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  let td = findTextDocument(fsPath);
  await td?.save();

  let name = await showInputBox();
  if (name) {
    let jsonPath = join(dirPath, `${name}.json`);
    copyFileSync(fsPath, jsonPath);
  }
}

async function _jsonSwap(...res: any[]) {
  console.log("_jsonSwap");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  let td = findTextDocument(fsPath);
  if (td?.isDirty) {
    showErrorMessage("Please Save File Before");
    return;
  }

  let jsonFileNameList = readdirSync(dirPath).filter((e) => e.endsWith(".json"));
  if (jsonFileNameList.length === 0) {
    showInformationMessage("No Find Json");
    return;
  }

  let jsonFileName = await showQuickPick(jsonFileNameList);
  if (jsonFileName) {
    saveSwapHistory(fsPath);
    let jsonFilePath = join(dirPath, jsonFileName);
    copyFileSync(jsonFilePath, fsPath);
  }
}

async function _jsonToEnv(...res: any[]) {
  console.log("_jsonToEnv");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  let envLocalName = await showQuickPick(envLocalNameList);
  if (envLocalName) {
    const jsonFileData: Record<string, any> = readJsonSync(fsPath);

    let jsonData = jsonAnyToString(jsonFileData);
    let pkgData = await loadPkgData(fsPath);

    jsonData = vueField(jsonData, pkgData);
    jsonData = reactField(jsonData, pkgData);

    let wf = findWorkspaceFolder(fsPath);
    let bf = [`# ${envLocalName}`];
    Object.keys(jsonData).forEach((k) => bf.push(`${k} = ${jsonData[k]}`));
    let envPath = join(wf?.uri.fsPath || "", envLocalName);
    writeFileSync(envPath, bf.join("\n"), "utf-8");
    addScriptInPkg(envLocalName, pkgData, fsPath);
  }
}

async function _jsonGitAssume(...res: any[]) {
  console.log("_jsonGitAssume");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  // let cmd = "git update-index --assume-unchanged " + fsPath;
  let wf = findWorkspaceFolder(fsPath);
  let cwd = wf?.uri.fsPath;
  execFileSync("git", ["update-index", "--assume-unchanged", fsPath], { cwd });
}

async function _jsonGitNoAssume(...res: any[]) {
  console.log("_jsonGitNoAssume");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  // let cmd = "git update-index --no-assume-unchanged " + fsPath;
  let wf = findWorkspaceFolder(fsPath);
  let cwd = wf?.uri.fsPath;
  execFileSync("git", ["update-index", "--no-assume-unchanged", fsPath], { cwd });
}

////////////////////////////////////////////////////////////////////////////////

export async function saveSwapHistory(fsPath: string) {
  console.log("saveSwapHistory");
  if (fsPath === "") return;

  let name = dateTimeName();
  let historyDirPath = join(dirPath, historyDirName);
  ensureDirSync(historyDirPath);

  let historyFilePath = join(historyDirPath, `${name}.json`);
  copyFileSync(fsPath, historyFilePath);
}
