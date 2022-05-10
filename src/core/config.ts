/*
 * @FilePath     : /src/core/config.ts
 * @Date         : 2022-04-30 20:56:00
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : 配置文件
 */

import { homedir } from "os";
import { join } from "path";
import { workspace } from "vscode";

export const name = "extra-config-json";

export const historyDirName = ".history";

export let dirPath = join(homedir(), `.${name}`);
export let onlyViteField = true;
export let onlyVueAppField = true;
export let onlyReactAppField = true;

export const envLocalNameList = [
  ".env.local",
  ".env.dev.local",
  ".env.development.local",
  ".env.test.local",
  ".env.qa.local",
  ".env.uat.local",
  ".env.stag.local",
  ".env.staging.local",
  ".env.production.local",
];

export function initConfig(): void {
  let cf = workspace.getConfiguration();
  let path = cf.get<string>("extra-config-json.dirPath") || dirPath;
  dirPath = path;
  onlyViteField = cf.get<boolean>("extra-config-json.onlyViteField") || onlyViteField;
  onlyVueAppField = cf.get<boolean>("extra-config-json.onlyVueAppField") || onlyVueAppField;
  onlyReactAppField = cf.get<boolean>("extra-config-json.onlyReactAppField") || onlyReactAppField;
}
