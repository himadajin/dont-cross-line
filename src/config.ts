import * as vscode from "vscode";

export interface LineLengthConfig {
  maxLength: number;
  enabled: boolean;
  warningColor: string;
  excludeLanguages: string[];
}

export function getConfiguration(): LineLengthConfig {
  const config = vscode.workspace.getConfiguration("dontCrossLine");

  return {
    maxLength: config.get<number>("maxLength", 80),
    enabled: config.get<boolean>("enabled", true),
    warningColor: config.get<string>("warningColor", "#ff6b6b"),
    excludeLanguages: config.get<string[]>("excludeLanguages", [
      "markdown",
      "plaintext",
    ]),
  };
}

export function isLanguageExcluded(
  languageId: string,
  excludeLanguages: string[]
): boolean {
  return excludeLanguages.includes(languageId);
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export function normalizeConfiguration(
  config: LineLengthConfig
): LineLengthConfig {
  return {
    maxLength: Math.max(1, config.maxLength),
    enabled: config.enabled,
    warningColor: isValidHexColor(config.warningColor)
      ? config.warningColor
      : "#ff6b6b",
    excludeLanguages: config.excludeLanguages,
  };
}
