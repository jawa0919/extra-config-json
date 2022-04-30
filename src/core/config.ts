/*
 * @FilePath     : /src/core/config.ts
 * @Date         : 2022-04-30 20:56:00
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : 配置文件
 */

import { ensureDirSync } from "fs-extra";
import { homedir } from "os";
import { join } from "path";
import { workspace } from "vscode";

export const name = "extra-config-json";

export const historyDirName = ".history";

export let dirPath = join(homedir(), `.${name}`);
export let onlyVueAppXX = true;
export let onlyReactAppXX = true;

export const envLocalNameList = [
  ".env.local",
  ".env.dev.local",
  ".env.build.local",
  ".env.development.local",
  ".env.test.local",
  ".env.qa.local",
  ".env.uat.local",
  ".env.stag.local",
  ".env.stage.local",
  ".env.staging.local",
  ".env.live.local",
  ".env.production.local",
  ".env.prod.local",
];

export function initConfig(): void {
  let path = workspace.getConfiguration().get<string>("extra-config-json.dirPath") || dirPath;
  ensureDirSync(path);
  dirPath = path;
  onlyVueAppXX = workspace.getConfiguration().get<boolean>("extra-config-json.onlyVueAppXX") || onlyVueAppXX;
  onlyReactAppXX = workspace.getConfiguration().get<boolean>("extra-config-json.onlyReactAppXX") || onlyReactAppXX;
}
