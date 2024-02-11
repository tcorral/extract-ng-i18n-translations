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
        const csvPath = core.getInput('CSV_PATH', { required: true });
        core.debug(`CSV Path value: ${directoryPath}`);

        core.debug(`Resolved path: ${path.resolve(directoryPath)}`);

        // Example usage
        const translations = extractTranslationsFromDirectory(path.resolve(directoryPath), defaultLocale, otherLocales);

        core.debug(`Translations: \r\n${JSON.stringify(translations)}`);

        core.notice(`Writing CSV file`);
        writeToCSV(translations, csvPath, defaultLocale, otherLocales);
        core.notice(`CSV file has been created in ${csvPath}`);
    } catch (error) {
        core.error(`Action has failed: ${error.message}`);
        core.setFailed(error.message);
    }
}

module.exports = {
    run
}