const { App, Notice, Plugin } = require("obsidian");
const { exec } = require("child_process");
const path = require("path");

const DEFAULT_SETTINGS = {
    mySetting: "default",
};

class VSCodeTrigger extends Plugin {
    async onload() {
        await this.loadSettings();
        this.addCommand({
            id: "open-active-file-in-vscode",
            name: "Open active note in VSCode",
            callback: () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    // Get the full path of the active file
                    const fullPath = path.join(
                        this.app.vault.adapter.basePath,
                        activeFile.path
                    );
                    new Notice(`Opening in VS Code: ${fullPath}`);

                    // Open the active file in VS Code
                    exec(`code "${fullPath}"`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                    });
                } else {
                    new Notice("No active file to open in VSCode.");
                }
            },
        });

        this.addCommand({
            id: "open-vault-vs-code",
            name: "Open vault in VS Code",
            callback: () => {
                const vaultPath = this.app.vault.adapter.basePath;
                new Notice(`Opening vault in VS Code: ${vaultPath}`);

                require('child_process').exec(`code "${vaultPath}"`);
            }
        });
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

module.exports = VSCodeTrigger;
