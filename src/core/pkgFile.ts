/*
 * @FilePath     : /src/core/pkgFile.ts
 * @Date         : 2022-04-30 20:38:13
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : package.json文件处理
 */

import { readJsonSync, writeJsonSync } from "fs-extra";
import { join } from "path";
import { onlyVueAppField, onlyReactAppField, onlyViteField } from "./config";
import { findWorkspaceFolder } from "./util";

interface PkgData {
  scripts?: {
    serve?: string;
    start?: string;
    dev?: string;
    [key: string]: any;
  };
  dependencies?: {
    vue?: string;
    react?: string;
    [key: string]: any;
  };
  devDependencies?: {
    vite?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export function loadPkgData(fsPath: string): PkgData {
  console.log("loadPkgData");
  let wf = findWorkspaceFolder(fsPath);

  let pkgPath = join(wf?.uri.fsPath || "", "package.json");
  // let pkgData = await require("read-pkg-up")({ cwd: pkgPath });
  let pkgData: PkgData = readJsonSync(pkgPath);
  return pkgData;
}

export function filterField(jsonData: Record<string, string>, pkgData: PkgData): Record<string, string> {
  console.log("filterField");
  if (pkgData.devDependencies?.vite) {
    return viteField(jsonData, pkgData);
  } else if (pkgData.dependencies?.vue) {
    return vueField(jsonData, pkgData);
  } else if (pkgData.dependencies?.react) {
    return reactField(jsonData, pkgData);
  } else {
    return jsonData;
  }
}

export function viteField(jsonData: Record<string, string>, pkgData: PkgData): Record<string, string> {
  console.log("viteField");
  if (onlyViteField) {
    let temp: Record<string, string> = {};
    Object.keys(jsonData).forEach((e) => {
      if (e.startsWith("VITE_")) {
        temp[e] = jsonData[e];
      }
    });
    return temp;
  }
  return jsonData;
}

export function vueField(jsonData: Record<string, string>, pkgData: PkgData): Record<string, string> {
  console.log("vueField");
  if (onlyVueAppField) {
    let temp: Record<string, string> = {};
    Object.keys(jsonData).forEach((e) => {
      if (e.startsWith("VUE_APP_")) {
        temp[e] = jsonData[e];
      }
    });
    return temp;
  }
  return jsonData;
}

export function reactField(jsonData: Record<string, string>, pkgData: PkgData): Record<string, string> {
  console.log("reactField");
  if (onlyReactAppField) {
    let temp: Record<string, string> = {};
    Object.keys(jsonData).forEach((e) => {
      if (e.startsWith("REACT_APP_")) {
        temp[e] = jsonData[e];
      }
    });
    return temp;
  }
  return jsonData;
}

export function addScriptInPkg(envLocalName: string, pkgData: PkgData, fsPath: string) {
  console.log("addScriptInPkg");
  let mode = envLocalName.replace(/.env./, "");

  let cmdSuffix = `--mode ${mode}`;
  pkgData.scripts = pkgData.scripts || {};
  if (pkgData.scripts.serve) {
    let name = `serve:${mode}`;
    if (pkgData.scripts?.[name]) return;
    // FIXME 2022-05-01 11:55:40 serve vue-cli
    let cmd = pkgData.scripts.serve;
    if (cmd.includes(cmdSuffix)) return;
    cmd += ` ${cmdSuffix}`;
    pkgData.scripts[name] = cmd;
  } else if (pkgData.scripts.start) {
    let name = `start:${mode}`;
    if (pkgData.scripts?.[name]) return;
    // FIXME 2022-05-01 11:55:40 start react-create-app
    let cmd = pkgData.scripts.start;
    if (cmd.includes(cmdSuffix)) return;
    cmd += ` ${cmdSuffix}`;
    pkgData.scripts[name] = cmd;
  } else if (pkgData.scripts.dev) {
    let name = `dev:${mode}`;
    if (pkgData.scripts?.[name]) return;
    // FIXME 2022-05-01 11:55:40 dev vite
    let cmd = pkgData.scripts.dev;
    if (cmd.includes(cmdSuffix)) return;
    cmd += ` ${cmdSuffix}`;
    pkgData.scripts[name] = cmd;
  } else if (pkgData.dependencies?.vue) {
    let name = `serve:${mode}`;
    if (pkgData.scripts?.[name]) return;
    pkgData.scripts[name] = `vue-cli-service serve ${cmdSuffix}`;
  } else if (pkgData.dependencies?.react) {
    let name = `start:${mode}`;
    if (pkgData.scripts?.[name]) return;
    pkgData.scripts[name] = `react-scripts start ${cmdSuffix}`;
  }

  let wf = findWorkspaceFolder(fsPath);
  let pkgPath = join(wf?.uri.fsPath || "", "package.json");

  writeJsonSync(pkgPath, pkgData, { spaces: 2 });
}
