Feature: RudderStack Login and Setup

  # Background:
  #   Given I navigate to the RudderStack application

  @smoke @login
Scenario: Verify events are delivered to Webhook destination
  Given I log in to RudderStack workspace
  And I capture and persist the Data Plane URL and HTTP source write key
  And I send all events via the HTTP API
  Then I navigate to the Webhook destination
  And I verify the event delivery metrics
