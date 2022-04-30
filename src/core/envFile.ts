/*
 * @FilePath     : /src/core/envFile.ts
 * @Date         : 2022-04-30 20:37:38
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : env文件处理
 */

import { ensureFileSync, existsSync, readFileSync, writeFileSync } from "fs-extra";
import { join } from "path";
import { commands } from "vscode";
import { saveSwapHistory } from "./jsonFile";
import { findWorkspaceFolder } from "./util";

export const envFileCMD = [
  commands.registerCommand("extra-config-json.env.save", _envSave),
  commands.registerCommand("extra-config-json.env.to.json", _envToJson),
];

async function _envSave(...res: any[]) {
  console.log("_envSave");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;
}

async function _envToJson(...res: any[]) {
  console.log("_envToJson");
  let fsPath: string = res[0].fsPath || "";
  if (fsPath === "") return;

  let envData = readFileSync(fsPath, "utf-8");
  let jsonData: Record<string, string> = {};
  envData.split("\n").forEach((line) => {
    if (line.startsWith("#")) return;
    let [key, value] = line.split("=").map((v) => v.trim());
    jsonData[key] = value;
  });

  let wf = findWorkspaceFolder(fsPath);
  let jsonPath = join(wf?.uri.fsPath || "", "public", `extraConfig.json`);
  if (existsSync(jsonPath)) saveSwapHistory(jsonPath);
  ensureFileSync(jsonPath);
  writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");
}
