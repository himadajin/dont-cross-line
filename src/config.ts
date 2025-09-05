import * as vscode from "vscode";

export interface LineLengthConfig {
  maxLength: number;
  enabled: boolean;
  warningColor: string;
  languages: string[];
}

export function getConfiguration(): LineLengthConfig {
  const config = vscode.workspace.getConfiguration("dont-cross-line");

  return {
    maxLength: config.get<number>("maxLength", 80),
    enabled: config.get<boolean>("enabled", true),
    warningColor: config.get<string>("warningColor", "#ff6b6b"),
    languages: config.get<string[]>("languages", []),
  };
}

export function isLanguageAllowed(languageId: string, languages: string[]): boolean {
  return languages.length > 0 && languages.includes(languageId);
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
    languages: Array.isArray(config.languages) ? config.languages : [],
  };
}
