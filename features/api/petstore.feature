# Petstore REST API - Pet CRUD Operations
# Endpoint: https://petstore.swagger.io/v2/pet
# Status codes verified: 200 (success), 404 (not found)

Feature: Petstore API - Pet CRUD Operations
  As a QA Engineer
  I want to automate the Pet endpoints on the Petstore Swagger API
  So that I can verify the API works correctly for all CRUD operations

  @api @smoke
  Scenario: TC-API-01 - POST /pet - Create a new pet successfully
    Given I have a pet payload with name "Bruno" and status "available"
    When I send a POST request to "/pet"
    Then the response status code should be 200
    And the response body should contain the pet name "Bruno"
    And the response body should contain the status "available"

  @api @smoke
  Scenario: TC-API-02 - GET /pet/{id} - Retrieve the created pet and verify it matches POST data
    Given I have previously created a pet with name "Bruno" and status "available"
    When I send a GET request to "/pet/{id}" using the created pet's ID
    Then the response status code should be 200
    And the response body pet name should match "Bruno"
    And the response body pet status should match "available"
    And the response body pet ID should match the one returned by POST

  @api @regression
  Scenario: TC-API-03 - PUT /pet - Update pet name and status
    Given I have previously created a pet with name "Bruno" and status "available"
    When I send a PUT request to "/pet" with updated name "Bruno Updated" and status "pending"
    Then the response status code should be 200
    And the response body should contain the pet name "Bruno Updated"
    And the response body should contain the status "pending"

  @api @regression
  Scenario: TC-API-04 - DELETE /pet/{id} - Delete pet and verify it no longer exists
    Given I have previously created a pet with name "Bruno" and status "available"
    When I send a DELETE request to "/pet/{id}" using the created pet's ID
    Then the response status code should be 200
    When I send a GET request to "/pet/{id}" using the created pet's ID
    Then the response status code should be 404

  @api @regression
  Scenario: TC-API-05 - GET /pet/{id} - Returns 404 for non-existent pet
    When I send a GET request to "/pet/999999999"
    Then the response status code should be 404
    And the response body should contain the message "Pet not found"
