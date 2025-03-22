const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    'readXlsx' : readXlsx.read,
    saveLogo({ filePath, data }) {
      try {
        const dir = path.dirname(filePath); // Get the directory path
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }
        fs.writeFileSync(filePath, data, 'binary'); // Save the logo as binary
        return null; // Return null to indicate success
      } catch (err) {
        throw new Error(Failed to save logo: ${err.message});
      }
    },
  });
};