/*
 * @FilePath     : /src/extension.ts
 * @Date         : 2022-04-27 11:09:45
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : 启动
 */

import * as vscode from "vscode";
import { initConfig } from "./core/config";
import { jsonFileCMD } from "./core/jsonFile";
import { envFileCMD } from "./core/envFile";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extra-config-json" is now active!');

  initConfig();
  vscode.workspace.onDidChangeConfiguration(() => {
    initConfig();
  });

  context.subscriptions.push(...jsonFileCMD);
  context.subscriptions.push(...envFileCMD);
}

export function deactivate() {}
