import * as vscode from "vscode";
import { calculateVisualWidth, findExceedingPosition } from "./characterWidth";
import {
  getConfiguration,
  isLanguageAllowed,
  normalizeConfiguration,
  LineLengthConfig,
} from "./config";

export class LineLengthIndicator {
  private decorationType: vscode.TextEditorDecorationType | undefined;
  private disposables: vscode.Disposable[] = [];
  private config: LineLengthConfig;

  constructor() {
    this.config = normalizeConfiguration(getConfiguration());
    this.createDecorationType();
    this.registerEventListeners();
    this.updateAllEditors();
  }

  private createDecorationType(): void {
    if (this.decorationType) {
      this.decorationType.dispose();
    }

    this.decorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: this.config.warningColor + "33", // 20% opacity
      border: `1px solid ${this.config.warningColor}`,
      borderRadius: "2px",
      overviewRulerColor: this.config.warningColor,
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });
  }

  private registerEventListeners(): void {
    // Text document change listener
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.visibleTextEditors.find(
          (e) => e.document === event.document
        );
        if (editor) {
          this.updateEditor(editor);
        }
      })
    );

    // Active text editor change listener
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.updateEditor(editor);
        }
      })
    );

    // Configuration change listener
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("dontCrossLine")) {
          this.config = normalizeConfiguration(getConfiguration());
          this.createDecorationType();
          this.updateAllEditors();
        }
      })
    );

    // Visible text editors change listener
    this.disposables.push(
      vscode.window.onDidChangeVisibleTextEditors((editors) => {
        editors.forEach((editor) => this.updateEditor(editor));
      })
    );
  }

  private updateAllEditors(): void {
    vscode.window.visibleTextEditors.forEach((editor) => {
      this.updateEditor(editor);
    });
  }

  private updateEditor(editor: vscode.TextEditor): void {
    if (!this.shouldProcessEditor(editor)) {
      return;
    }

    try {
      const decorations = this.calculateDecorations(editor);
      if (this.decorationType) {
        editor.setDecorations(this.decorationType, decorations);
      }
    } catch (error) {
      console.error("DontCrossLine: Error updating editor decorations:", error);
    }
  }

  private shouldProcessEditor(editor: vscode.TextEditor): boolean {
    if (!this.config.enabled) {
      return false;
    }

    if (!this.decorationType) {
      return false;
    }

    const languageId = editor.document.languageId;
    if (!isLanguageAllowed(languageId, this.config.languages)) {
      return false;
    }

    return true;
  }

  private calculateDecorations(
    editor: vscode.TextEditor
  ): vscode.DecorationOptions[] {
    const decorations: vscode.DecorationOptions[] = [];
    const document = editor.document;
    const tabSize = (editor.options.tabSize as number) || 4;

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
      const line = document.lineAt(lineNumber);
      const lineText = line.text;

      const exceedingPosition = findExceedingPosition(
        lineText,
        this.config.maxLength,
        tabSize
      );

      if (exceedingPosition !== null) {
        const actualWidth = calculateVisualWidth(lineText, tabSize);
        const startPos = new vscode.Position(lineNumber, exceedingPosition);
        const endPos = new vscode.Position(lineNumber, lineText.length);

        const decoration: vscode.DecorationOptions = {
          range: new vscode.Range(startPos, endPos),
          hoverMessage: `Line length exceeds limit (${actualWidth}/${this.config.maxLength})`,
        };

        decorations.push(decoration);
      }
    }

    return decorations;
  }

  public toggle(): void {
    this.config.enabled = !this.config.enabled;

    // Update the configuration
    const config = vscode.workspace.getConfiguration("dontCrossLine");
    config.update(
      "enabled",
      this.config.enabled,
      vscode.ConfigurationTarget.Global
    );

    this.updateAllEditors();

    vscode.window.showInformationMessage(
      `Don't Cross Line ${this.config.enabled ? "enabled" : "disabled"}`
    );
  }

  public dispose(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];

    if (this.decorationType) {
      this.decorationType.dispose();
      this.decorationType = undefined;
    }
  }
}
