# Don't Cross Line

A VSCode extension that provides visual line length indicators with proper multibyte character support.

## Features

- **Visual highlighting** of exceeded portions with customizable colors
- **Language exclusion** support to disable checking for specific file types

## Configuration

The extension provides the following configuration options:

- `dont-cross-line.maxLength` (default: 80): Maximum line length in visual width
- `dont-cross-line.enabled` (default: true): Enable/disable the extension
- `dont-cross-line.warningColor` (default: "#ff6b6b"): Color for highlighting exceeded portions
- `dont-cross-line.languages` (default: `[]`): Language IDs where the indicator is enabled.

## Commands

- `Toggle Don't Cross Line`: Enable/disable the extension

## Character Width Calculation

The extension properly calculates character widths for:

- ASCII characters (width: 1)
- Half-width katakana (width: 1)
- Hiragana, katakana, and kanji (width: 2)
- Full-width ASCII characters (width: 2)
- Emoji and symbols (width: 2)
- Tab characters (configurable width)

## Development

To build the extension:

```bash
npm install
npm run compile
```
