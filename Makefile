BUILD_DIR:=build

version=$(shell node -p "require('./package.json').version")
vsix=$(BUILD_DIR)/dont-cross-line-$(version).vsix

.PHONY: package
package: $(vsix)

.PHONY: install
install: $(vsix)
	code --install-extension $(vsix)

.PHONY: compile
compile:
	npm run compile

.PHONY: deps
deps:
	npm install

$(vsix): $(BUILD_DIR) deps compile
	npx vsce package --out $(vsix)

$(BUILD_DIR):
	mkdir -p $@

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)
	rm -rf out
	rm -rf node_modules

.PHONY: clean-build
clean-build:
	rm -rf $(BUILD_DIR)
	rm -rf out

.PHONY: dev
dev: deps compile

.PHONY: all
all: clean dev package

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  deps        - Install npm dependencies"
	@echo "  compile     - Compile TypeScript to JavaScript"
	@echo "  package     - Create VSIX package"
	@echo "  install     - Install the extension in VSCode"
	@echo "  dev         - Install deps and compile"
	@echo "  all         - Clean, compile, and package"
	@echo "  clean       - Remove all build artifacts and dependencies"
	@echo "  clean-build - Remove only build artifacts"
	@echo "  help        - Show this help message"
