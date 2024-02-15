import { getJavaOptions } from "./getJavaOptions";
import * as path from "path";

export interface JavaConfig {
  javaOptions: string[];
  javaPath: string;
  coursierPath: string;
  coursierMirrorFilePath: string | undefined;
  extraEnv: {
    [k: string]: string | undefined;
  };
}

interface GetJavaConfigOptions {
  workspaceRoot: string | undefined;
  javaHome: string;
  extensionPath: string;
  coursierMirrorFilePath: string | undefined;
  customRepositories: string[] | undefined;
}

export function getJavaConfig({
  workspaceRoot,
  javaHome,
  extensionPath,
  coursierMirrorFilePath,
  customRepositories = [],
}: GetJavaConfigOptions): JavaConfig {
  const javaOptions = getJavaOptions(workspaceRoot);
  const javaPath = path.join(javaHome, "bin", "java");
  const coursierPath = path.join(extensionPath, "./coursier");

  const coursierRepositories =
    customRepositories.length > 0
      ? { COURSIER_REPOSITORIES: customRepositories.join("|") }
      : {};
  const coursierMirrors = coursierMirrorFilePath
    ? { COURSIER_MIRRORS: coursierMirrorFilePath }
    : {};

  const extraEnv = {
    ...coursierRepositories,
    ...coursierMirrors,
    JAVA_HOME: javaHome,
  };

  return {
    javaOptions,
    javaPath,
    coursierPath,
    coursierMirrorFilePath,
    extraEnv,
  };
}
