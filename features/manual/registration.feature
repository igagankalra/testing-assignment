# Registration flow for https://www.gametwist.com/en/
#
# Automation Strategy:
# TC-REG-01, 02, 03, 05: Automate (stable UI, high business value)
# TC-REG-04: Manual (CAPTCHA is designed to block automation)

Feature: User Registration on GameTwist
  As a new visitor to GameTwist.com
  I want to create an account
  So that I can access the games and features of the platform

  Background:
    Given the user is on the GameTwist homepage "https://www.gametwist.com/en/"
    And the user clicks on the "Register" button

  @smoke @regression @automated
  Scenario: TC-REG-01 - Successful registration with valid details
    When the user enters a unique valid email address
    And the user enters a valid username between 3 and 20 characters
    And the user enters a password that meets complexity requirements
    And the user enters the same password in the confirm password field
    And the user selects their date of birth indicating they are over 18
    And the user accepts the Terms and Conditions
    And the user clicks the "Complete Registration" button
    Then the user should be redirected to the GameTwist dashboard
    And a welcome message should be displayed
    And a confirmation email should be sent to the registered email address

  @regression @automated
  Scenario: TC-REG-02 - Registration with an already registered email
    Given a user account already exists with email "existing.user@example.com"
    When the user enters the email address "existing.user@example.com"
    And the user fills in all other required fields with valid data
    And the user clicks the "Complete Registration" button
    Then an error message should be displayed saying "This email address is already registered"
    And the user should remain on the registration page

  @regression @automated
  Scenario Outline: TC-REG-03 - Registration with invalid password formats
    When the user enters a valid email address
    And the user enters a valid username
    And the user enters the password "<password>"
    And the user clicks the "Complete Registration" button
    Then an error message "<error_message>" should be displayed
    And the user should remain on the registration page

    Examples:
      | password  | error_message                                      |
      | abc       | Password must be at least 8 characters             |
      | 12345678  | Password must contain at least one letter          |
      | abcdefgh  | Password must contain at least one number          |
      | abc 1234  | Password must not contain spaces                   |
      |           | Password is required                               |

  # CAPTCHA is designed to block automation; manual verification required
  @manual
  Scenario: TC-REG-04 - Registration blocked when CAPTCHA is not completed
    When the user fills in all required registration fields with valid data
    And the user does NOT complete the CAPTCHA verification
    And the user clicks the "Complete Registration" button
    Then the form should not be submitted
    And a message should prompt the user to complete the CAPTCHA

  @regression @automated
  Scenario: TC-REG-05 - Registration blocked for users under 18
    When the user enters a valid email address
    And the user enters a valid username
    And the user enters a valid password
    And the user selects a date of birth indicating they are under 18 years old
    And the user clicks the "Complete Registration" button
    Then an error message should be displayed saying "You must be at least 18 years old to register"
    And the user should remain on the registration page
