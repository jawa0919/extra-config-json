/*
 * @FilePath     : /src/core/pkgFile.ts
 * @Date         : 2022-04-30 20:38:13
 * @Author       : jawa0919 <jawa0919@163.com>
 * @Description  : package.json文件处理
 */

import { join } from "path";
import { NormalizedPackageJson, PackageJson } from "read-pkg-up";
import { findWorkspaceFolder } from "./util";

export async function loadPkgData(fsPath: string): Promise<PackageJson | NormalizedPackageJson> {
  console.log("pkgData");
  let wf = findWorkspaceFolder(fsPath);

  let pkgPath = join(wf?.uri.fsPath || "", "package.json");
  let pkgData = await require("read-pkg-up")({ cwd: pkgPath });
  return pkgData.packageJson;
}

export function onlyVueField(
  jsonData: Record<string, any>,
  pkgData: PackageJson | NormalizedPackageJson
): Record<string, any> {
  console.log("onlyVueField");
  // TODO 2022-04-30 23:34:43 VUE_APP_
  return jsonData;
}

export function onlyReactField(
  jsonData: Record<string, any>,
  pkgData: PackageJson | NormalizedPackageJson
): Record<string, any> {
  console.log("onlyReactField");
  // TODO 2022-04-30 23:34:58 REACT_APP_
  return jsonData;
}

export function addScriptInPkg(envLocalName: string, pkgData: PackageJson | NormalizedPackageJson) {
  console.log("addScriptInPkg");
  // TODO 2022-04-30 23:35:07 envLocalName
}
