const core = require('@actions/core');
const path = require('path');
const utils = require('./utils');

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
        core.debug(`CSV Path value: ${csvPath}`);

        // Example usage
        const translations = utils.extractTranslationsFromDirectory(path.resolve(directoryPath), defaultLocale, otherLocales);

        core.debug(`Translations: ${JSON.stringify(translations)}`);

        core.notice(`Writing CSV file`);
        utils.writeToCSV(translations, csvPath, defaultLocale, otherLocales);
        core.notice(`CSV file has been created in ${csvPath}`);
    } catch (error) {
        core.error(`Action has failed: ${error.message}`);
        core.setFailed(error.message);
    }
}

module.exports = {
    run
}