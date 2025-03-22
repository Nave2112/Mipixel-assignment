
// Test Suite
describe('Extract and Save Contact Details with Logos', () => {
  it('Extracts contact info, downloads logos, and writes to a JSON file', () => {
    cy.visit('https://www.medicines.org.uk/emc/browse-companies');

    cy.get('[class="browse-results"] > a').then(($companies) => {
      const companyData = [];
      const indexes = [0, 2, $companies.length - 1]; // First, third, and last company

      indexes.forEach((index) => {
        const company = $companies[index];
        const companyName = company.innerText.trim().replace(/\s+/g, '_'); // Replace spaces with underscores for filenames

        cy.wrap(company)
          .invoke('attr', 'href')
          .then((relativeUrl) => {
            const absoluteUrl = `https://www.medicines.org.uk${relativeUrl}`;
            cy.visit(absoluteUrl, { timeout: 10000 });

            // Extract contact details
            cy.get('[class="company-details-contact-items"]').then(($contactSection) => {
              const contactDetails = {};
              $contactSection.find('div.company-contacts-item-title').each((_, el) => {
                const label = el.innerText.trim();
                const value = el.nextElementSibling?.innerText.trim() || '';

                if (label.includes('Address')) contactDetails.address = value;
                else if (label.includes('Telephone')) contactDetails.telephone = value;
                else if (label.includes('Fax')) contactDetails.fax = value;
                else if (label.includes('Medical Information e-mail')) contactDetails.medicalEmail = value;
                else if (label.includes('Medical Information Direct Line')) contactDetails.medicalDirectLine = value;
                else if (label.includes('Out of Hours Telephone')) contactDetails.outOfHoursTelephone = value;
              });

              // Extract logo URL
              cy.get('img[alt="Company image"]').invoke('attr', 'src').then((logoRelativeUrl) => {
                const logoUrl = `https://www.medicines.org.uk${logoRelativeUrl}`;
                const logoFilename = `${companyName}_logo.png`;
                const logoPath = path.join(__dirname, '..', 'cypress', 'fixtures', 'logos', logoFilename);
                // Download and save the logo image using the task
                cy.request({
                  url: logoUrl,
                  encoding: 'binary',
                }).then((response) => {
                  expect(response.status).to.eq(200);

                  cy.task('saveLogo', { filePath: logoPath, data: response.body }).then(() => {
                    cy.log(`Logo saved as: ${logoFilename}`);

                    companyData.push({
                      company: companyName,
                      contact: contactDetails,
                      logo: logoFilename,
                    });
                  });
                });
              });
            });
          });
      });

      // Write the collected data to a JSON file
      cy.then(() => {
        const filePath = 'cypress/fixtures/company-contacts.json';
        cy.writeFile(filePath, companyData).then(() => {
          cy.log(`Contact details written to ${filePath}`);
        });
      });
    });
  });
});
