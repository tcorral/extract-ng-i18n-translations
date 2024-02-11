const core = require('@actions/core');
const path = require('path');
const Utils = require('./utils');
const extractTranslationsFromDirectory = Utils.extractTranslationsFromDirectory;
const writeToCSV = Utils.writeToCSV;

async function run() {
    try {
        // Arguments
        const directoryPath = core.getInput('DIRECTORY_PATH', { required: true });
        core.debug(`Directory Path value: ${directoryPath}`);
        const defaultLocale = core.getInput('DEFAULT_LOCALE', { required: true });
        core.debug(`Default Locale value: ${defaultLocale}`);
        let otherLocales = core.getInput('OTHER_LOCALES');
        otherLocales = otherLocales.length === 0 ? [] : otherLocales.split(',');
        core.debug(`Other locales value: ${otherLocales}`);

        // Example usage
        const translations = extractTranslationsFromDirectory(directoryPath, defaultLocale, otherLocales);

        core.debug(`Translations: \r\n${JSON.stringify(translations)}`);

        const outputPath = path.join(process.cwd(), 'translations.csv');
        core.debug(`Output path: ${outputPath}`);

        core.notice(`Writing CSV file`);
        writeToCSV(translations, outputPath, defaultLocale, otherLocales);
        core.notice(`CSV file has been created in ${outputPath}`);
    } catch (error) {
        core.error(`Action has failed: ${error.message}`);
        core.setFailed(error.message);
    }
}

module.exports = {
    run
}