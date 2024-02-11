/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core');
const main = require('../src/main');
const utils = require('../src/utils');

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation();
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Mock the extractTranslationsFromDirectory function
const extractTranslationsFromDirectoryMock = jest.spyOn(utils, 'extractTranslationsFromDirectory').mockImplementation();

// Mock the extractTranslationsFromDirectory function
const writeToCSVMock = jest.spyOn(utils, 'writeToCSV').mockImplementation();

const expectedTranslations = `[{"key":"K","en-GB":"A","context":"B","es":"","fr":"","nl":""},{"key":"KK","en-GB":"AA","context":"BB","es":"","fr":"","nl":""},{"key":"KKK","en-GB":"AAA","context":"BBB","es":"","fr":"","nl":""},{"key":"KKKK","en-GB":"AAAA","context":"BBBB","es":"","fr":"","nl":""},{"key":"KKKKK","en-GB":"AAAAA","context":"BBBBB","es":"","fr":"","nl":""},{"key":"KKKKKK","en-GB":"AAAAAA","context":"BBBBBB","es":"","fr":"","nl":""},{"key":"KKKKKKK","en-GB":"AAAAAAA","context":"BBBBBBB","es":"","fr":"","nl":""},{"key":"KKKKKKKK","en-GB":"AAAAAAAA","context":"BBBBBBBB","es":"","fr":"","nl":""},{"key":"KKKKKKKKK","en-GB":"AAAAAAAAA","context":"BBBBBBBBB","es":"","fr":"","nl":""}]`;
const directoryPath = '.';
const defaultLocale = 'en-GB';
const otherLocales = 'es,fr,nl';
const csvPath = './translations.csv';

describe('action', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('fails if no input is provided', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'DIRECTORY_PATH':
            throw new Error('Input required and not supplied: DIRECTORY_PATH')
          default:
            return ''
        }
      });
  
      await main.run();
      expect(runMock).toHaveReturned();
  
      // Verify that all of the core library functions were called correctly
      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'Input required and not supplied: DIRECTORY_PATH'
      );
    });
  
    it('sets the value of the required arguments', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'DIRECTORY_PATH':
            return directoryPath;
          case 'DEFAULT_LOCALE':
            return defaultLocale;
          case 'OTHER_LOCALES':
            return otherLocales;
          case 'CSV_PATH':
            return csvPath;
          default:
            return '';
        }
      });

      extractTranslationsFromDirectoryMock.mockImplementation(() => {
        return expectedTranslations;
      });
      writeToCSVMock.mockImplementation(() => {});
  
      await main.run();
      expect(runMock).toHaveReturned();
  
      // Verify that all of the core library functions were called correctly
      expect(debugMock).toHaveBeenNthCalledWith(1, `Directory Path value: ${directoryPath}`);
      expect(debugMock).toHaveBeenNthCalledWith(2, `Default Locale value: ${defaultLocale}`);
      expect(debugMock).toHaveBeenNthCalledWith(3, `Other locales value: ${otherLocales}`);
      expect(debugMock).toHaveBeenNthCalledWith(4, `CSV Path value: ${csvPath}`);
    });

    it('nine translation items have been returned and stored in csv file', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'DIRECTORY_PATH':
            return directoryPath;
          case 'DEFAULT_LOCALE':
            return defaultLocale;
          case 'OTHER_LOCALES':
            return otherLocales;
          case 'CSV_PATH':
            return csvPath;
          default:
            return '';
        }
      });
      
      extractTranslationsFromDirectoryMock.mockImplementation(() => {
        return expectedTranslations;
      });
      writeToCSVMock.mockImplementation(() => {});

      await main.run();
      expect(runMock).toHaveReturned();
  
      // Verify that all of the core library functions were called correctly
      expect(writeToCSVMock).toHaveBeenCalledWith(
        expectedTranslations,
        csvPath,
        defaultLocale,
        otherLocales.split(',')
      );
    });
  });