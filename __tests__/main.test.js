/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core');
const main = require('../src/main');

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation();
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

describe('action', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })
  
    it('sets the value of the required arguments', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'DIRECTORY_PATH':
            return '.';
          case 'DEFAULT_LOCALE':
            return 'en-GB';
          case 'OTHER_LOCALES':
            return 'es,fr,nl';
          default:
            return '';
        }
      })
  
      await main.run()
      expect(runMock).toHaveReturned()
  
      // Verify that all of the core library functions were called correctly
      expect(debugMock).toHaveBeenNthCalledWith(1, 'Directory Path value: .');
      expect(debugMock).toHaveBeenNthCalledWith(1, 'Default Locale value: en-GB');
      expect(debugMock).toHaveBeenNthCalledWith(1, 'Other locales value: es,fr,nl')
    })
  
    it('fails if no input is provided', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'DIRECTORY_PATH':
            throw new Error('Input required and not supplied: DIRECTORY_PATH')
          default:
            return ''
        }
      })
  
      await main.run()
      expect(runMock).toHaveReturned()
  
      // Verify that all of the core library functions were called correctly
      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'Input required and not supplied: DIRECTORY_PATH'
      )
    });
  });