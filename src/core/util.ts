/*
 * @FilePath     : /src/core/util.ts
 * @Date         : 2022-04-30 21:51:35
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : 工具
 */

import { TextDocument, window, workspace, WorkspaceFolder } from "vscode";

export function findTextDocument(fsPath: string): TextDocument | undefined {
  return workspace.textDocuments.find((e) => fsPath === e.uri.fsPath);
}

export function findWorkspaceFolder(fsPath: string): WorkspaceFolder | undefined {
  return workspace.workspaceFolders?.find((r) => fsPath.startsWith(r.uri.fsPath));
}

export async function showInputBox(): Promise<string | undefined> {
  let opt = {
    title: "Please Input File Name",
    placeHolder: "Please Input File Name eg: gat sdk gz_dev py_test",
  };
  return await window.showInputBox(opt);
}

export async function showQuickPick(fileList: string[]): Promise<string | undefined> {
  return await window.showQuickPick(fileList);
}

export async function showInformationMessage(message: string): Promise<string | undefined> {
  return await window.showInformationMessage(message);
}

export async function showErrorMessage(message: string): Promise<string | undefined> {
  return await window.showErrorMessage(message);
}

export function dateTimeName(): string {
  return new Date().toISOString().substring(0, 19).replace(/[-:T]/g, "");
}

export function jsonAnyToString(res: Record<string, any>): Record<string, string> {
  let temp: Record<string, string> = {};
  Object.keys(res).forEach((key) => {
    if (typeof res[key] === "object") {
      temp[key] = JSON.stringify(res[key]);
    } else {
      temp[key] = res[key];
    }
  });
  return temp;
}
