import * as vscode from "vscode";
import { LineLengthIndicator } from "./lineLengthIndicator";

let lineLengthIndicator: LineLengthIndicator | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("Don't Cross Line extension is now active");

  try {
    // Create the line length indicator
    lineLengthIndicator = new LineLengthIndicator();

    // Register the toggle command
    const toggleCommand = vscode.commands.registerCommand(
      "dont-cross-line.toggle",
      () => {
        if (lineLengthIndicator) {
          lineLengthIndicator.toggle();
        }
      }
    );

    // Add disposables to the context
    context.subscriptions.push(toggleCommand);
    context.subscriptions.push({
      dispose: () => {
        if (lineLengthIndicator) {
          lineLengthIndicator.dispose();
        }
      },
    });
  } catch (error) {
    console.error("Error activating Don't Cross Line extension:", error);
    vscode.window.showErrorMessage(
      "Failed to activate Don't Cross Line extension"
    );
  }
}

export function deactivate() {
  console.log("Don't Cross Line extension is now deactivated");

  if (lineLengthIndicator) {
    lineLengthIndicator.dispose();
    lineLengthIndicator = undefined;
  }
}
