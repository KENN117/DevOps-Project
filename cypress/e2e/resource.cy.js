describe('Student Search Frontend', () => {
  let baseUrl

  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url + "/search.html"; // Stores the base URL
      cy.visit(baseUrl)
    });
  });

  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  beforeEach(() => {
    cy.visit(baseUrl); // Reload the page before each test
  });

  it('should search for a student by ID and display the correct details', () => {
    // Enter a student ID in the search input
    cy.get('#searchInput').type('1', { force: true });
    // Click the search button
    cy.get("#searchButton").should("be.visible").click();
    // Verify the student details are displayed
    cy.get('#result').should('contain', 'ID: 1');
    cy.get('#result').should('contain', 'Name: Alice Johnson');
    cy.get('#result').should('contain', 'Classes Enrolled');
    cy.get('#result').should('contain', 'Math'); // Example class
    cy.get('#searchInput').clear()

});

it('should search for a student by name and display the correct details', () => {
    // Clear the input and enter a student name
    cy.get('#searchInput').type('bob', { force: true });
    // Click the search button
    cy.get("#searchButton").should("be.visible").click();
    // Verify the student details are displayed
    cy.get('#result').should('contain', 'Name: Bob Smith');
    cy.get('#result').should('contain', 'Classes Enrolled');
    cy.get('#result').should('contain', 'Science'); // Example class
});

it('should display an error message for empty input', () => {
    // Clear the input and leave it empty
    cy.get('#searchInput').clear();
    // Click the search button
    cy.get("#searchButton").should("be.visible").click();
    // Verify the error message is displayed
    cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Please enter a search query');
    });
});

it('should display a "not found" message for non-existent student', () => {
    // Enter a non-existent student ID
    cy.get('#searchInput').clear().type('99', { force: true });
    // Click the search button
    cy.get('#searchButton').click();
    // Verify the "not found" message is displayed
    cy.get('#result').should('contain', 'No student found with that ID or name.');
});

});


