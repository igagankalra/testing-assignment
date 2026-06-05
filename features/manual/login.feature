# Login flow for https://www.gametwist.com/en/
#
# Automation Strategy:
# TC-LOG-01, 02, 03, 04: Automate (security-critical, regression tests)
# TC-LOG-05: Manual (requires email service integration)

Feature: User Login on GameTwist
  As a registered user of GameTwist.com
  I want to log in to my account
  So that I can access my games, coins, and profile

  Background:
    Given the user is on the GameTwist homepage "https://www.gametwist.com/en/"
    And a registered account exists with email "test.user@example.com" and password "ValidPass1"
    And the user clicks on the "Log In" button

  @smoke @regression @automated
  Scenario: TC-LOG-01 - Successful login with valid credentials
    When the user enters the email "test.user@example.com"
    And the user enters the password "ValidPass1"
    And the user clicks the "Log In" button
    Then the user should be redirected to the GameTwist dashboard
    And the user's username should be visible in the navigation bar
    And the user's coin balance should be displayed

  @regression @automated
  Scenario: TC-LOG-02 - Login attempt with incorrect password
    When the user enters the email "test.user@example.com"
    And the user enters an incorrect password "WrongPass99"
    And the user clicks the "Log In" button
    Then an error message should be displayed saying "Invalid email or password"
    And the user should remain on the login page
    And the user should NOT be logged in

  @regression @automated
  Scenario Outline: TC-LOG-03 - Login with missing or invalid fields
    When the user enters the email "<email>"
    And the user enters the password "<password>"
    And the user clicks the "Log In" button
    Then an error message "<error_message>" should be displayed

    Examples:
      | email                     | password   | error_message                    |
      |                           | ValidPass1 | Email is required                |
      | test.user@example.com     |            | Password is required             |
      |                           |            | Email and password are required  |
      | not-a-valid-email         | ValidPass1 | Please enter a valid email       |

  @regression @automated
  Scenario: TC-LOG-04 - Account locked after 5 consecutive failed login attempts
    When the user attempts to log in with wrong credentials 5 times in a row
    Then the account should be temporarily locked
    And an error message should be displayed saying "Your account has been temporarily locked due to too many failed attempts"
    And the user should be unable to log in even with correct credentials
    And a lockout notification email should be sent to "test.user@example.com"

  # Email-dependent; manual verification or email service integration required
  @manual
  Scenario: TC-LOG-05 - Password reset email sent for registered account
    When the user clicks the "Forgot Password?" link
    And the user enters the registered email "test.user@example.com"
    And the user clicks the "Send Reset Link" button
    Then a success message should be displayed saying "A password reset link has been sent to your email"
    And a password reset email should arrive in the inbox within 2 minutes
    And the reset link in the email should be valid and lead to a password reset form
