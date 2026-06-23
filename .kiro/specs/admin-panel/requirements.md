# Requirements Document

## Introduction

This document describes the requirements for the **ChatReel Admin Panel** — a complete back-office management interface for the ChatReel real-time chat application. The admin panel is accessible exclusively to users with the `is_admin` flag, and provides full control over users, conversations, messages, moderation, statistics, and application settings. The frontend is built with React 18 and Tailwind CSS; the backend extends the existing Laravel 11 REST API (AdminController).

---

## Glossary

- **Admin_Panel**: The React 18 single-page back-office application rendered at a dedicated route (e.g. `/admin`), accessible only to authenticated admin users.
- **Admin_API**: The set of Laravel 11 REST API endpoints under `/api/admin/*` served by `AdminController`, protected by Sanctum auth and the admin guard.
- **Admin_User**: A User whose `is_admin` field is `true`.
- **Regular_User**: A User whose `is_admin` field is `false`.
- **Conversation**: A record in the `conversations` table linking `user_one_id` and `user_two_id`, containing zero or more Messages.
- **Message**: A record in the `messages` table belonging to a Conversation, with a `sender_id`, `message` body, and `is_read` flag.
- **Report**: A record in the `reports` table with fields `reporter_id`, `reported_id`, `reason`, `details`, and `status` (pending / resolved).
- **Setting**: A key-value record in the `settings` table used to configure application behaviour (AI prompt, email config, banned words, welcome message).
- **Suspension**: A User's `suspended_until` timestamp being set to a future date, preventing the user from sending messages until that date passes.
- **Warning**: An increment to a User's `warning_count` field accompanied by a system message delivered to that user.
- **Dashboard**: The landing page of the Admin_Panel displaying aggregated statistics and charts.
- **Banned_Words**: A comma-separated list stored in the Setting with key `banned_words`; matched words in new messages are automatically replaced with asterisks.

---

## Requirements

### Requirement 1: Admin Authentication and Access Control

**User Story:** As an Admin_User, I want only authenticated administrators to access the Admin_Panel, so that regular users and unauthenticated visitors cannot view or modify administrative data.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to the admin route, THE Admin_Panel SHALL redirect the user to the login page.
2. WHEN an authenticated Regular_User attempts to access the admin route, THE Admin_Panel SHALL display an "Access Denied" page with a link back to the main application.
3. WHEN an Admin_User authenticates via the existing Sanctum token, THE Admin_Panel SHALL grant access and render the Dashboard.
4. WHEN the Admin_API receives a request without a valid Sanctum token, THE Admin_API SHALL return an HTTP 401 response.
5. WHEN the Admin_API receives a request from an authenticated Regular_User, THE Admin_API SHALL return an HTTP 403 response.
6. THE Admin_Panel SHALL display the authenticated Admin_User's name and avatar in the navigation header at all times.

---

### Requirement 2: Dashboard and Statistics

**User Story:** As an Admin_User, I want a visual dashboard with key metrics, so that I can monitor the health and activity of the ChatReel platform at a glance.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Dashboard, THE Admin_Panel SHALL display the total number of registered users, total number of messages, number of users active today, and number of new registrations today.
2. WHEN the Admin_User opens the Dashboard, THE Admin_Panel SHALL display the total number of invitations sent and the number of invitations accepted.
3. WHEN the Admin_User opens the Dashboard, THE Admin_Panel SHALL display the number of pending moderation reports.
4. WHEN the Admin_User opens the Dashboard, THE Admin_Panel SHALL render a bar chart showing the number of messages per day for the last 30 days.
5. WHEN the Admin_API receives a GET request to `/api/admin/stats`, THE Admin_API SHALL return all statistics defined in acceptance criteria 1–3 in a single JSON response within 2 seconds.
6. THE Dashboard SHALL use distinct icon-labelled metric cards (no emojis) for each statistic and SHALL apply a modern color scheme consistent with the rest of the Admin_Panel.

---

### Requirement 3: User Management — Listing and Search

**User Story:** As an Admin_User, I want to view and search all registered users, so that I can quickly find and inspect any account.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Users section, THE Admin_Panel SHALL display a paginated table of all users showing: avatar, name, email, registration date, last seen date, admin role badge, and account status (active / blocked / suspended).
2. WHEN the Admin_User types a query in the search field, THE Admin_Panel SHALL filter the displayed users by name or email within 500ms of the last keystroke without a full page reload.
3. WHEN the Admin_API receives a GET request to `/api/admin/users` with a `q` query parameter, THE Admin_API SHALL return only users whose name or email contains the search term (case-insensitive).
4. THE Admin_Panel SHALL display a loading indicator while user data is being fetched from the Admin_API.

---

### Requirement 4: User Management — Create, Edit, and Delete

**User Story:** As an Admin_User, I want to create, edit, and delete user accounts, so that I can manage the user base directly without requiring users to self-register.

#### Acceptance Criteria

1. WHEN the Admin_User submits the Create User form with a valid name, email, and password, THE Admin_API SHALL create the user and return the new user object with HTTP 201.
2. WHEN the Admin_User submits the Create User form with an email that already exists, THE Admin_API SHALL return an HTTP 422 response with a validation error message.
3. WHEN the Admin_User submits the Edit User form with updated name, email, bio, or password, THE Admin_API SHALL persist the changes and return the updated user object with HTTP 200.
4. WHEN the Admin_User confirms deletion of a user, THE Admin_API SHALL delete the user's account and all associated Sanctum tokens, then return HTTP 200 with a confirmation message.
5. IF the Admin_User attempts to delete their own account, THEN THE Admin_API SHALL return HTTP 422 with the message "Cannot delete yourself."
6. THE Admin_Panel SHALL display a confirmation dialog before executing any user deletion, describing the irreversible nature of the action.

---

### Requirement 5: User Management — Block, Unblock, and Role Assignment

**User Story:** As an Admin_User, I want to block, unblock, and change the admin role of users, so that I can control platform access and privileges.

#### Acceptance Criteria

1. WHEN the Admin_User activates the Block action for a Regular_User, THE Admin_API SHALL set `is_blocked = true` for that user and return HTTP 200.
2. WHEN the Admin_User activates the Unblock action for a blocked user, THE Admin_API SHALL set `is_blocked = false` for that user and return HTTP 200.
3. WHEN the Admin_User grants the admin role to a Regular_User, THE Admin_API SHALL set `is_admin = true` for that user and return the updated user object.
4. WHEN the Admin_User revokes the admin role from an Admin_User, THE Admin_API SHALL set `is_admin = false` for that user and return the updated user object.
5. THE Admin_Panel SHALL reflect the updated user status (blocked/admin badge) immediately after a successful API response without requiring a full page reload.

---

### Requirement 6: Conversation Management

**User Story:** As an Admin_User, I want to view and manage all conversations on the platform, so that I can investigate disputes and remove inappropriate exchanges.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Conversations section, THE Admin_Panel SHALL display a list of all conversations showing: participant names and avatars, total message count, and the date of the last message.
2. WHEN the Admin_User selects a conversation, THE Admin_Panel SHALL display the full message history between the two participants in chronological order.
3. WHEN the Admin_User confirms deletion of a conversation, THE Admin_API SHALL delete all Messages belonging to that Conversation and return HTTP 200.
4. THE Admin_Panel SHALL display a confirmation dialog before executing any conversation deletion, warning that all messages in the conversation will be permanently removed.

---

### Requirement 7: Message Management — Listing, Search, and Deletion

**User Story:** As an Admin_User, I want to browse, search, and delete individual messages, so that I can quickly act on specific harmful content.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Messages section, THE Admin_Panel SHALL display a paginated list of all messages showing: sender name, receiver name, message preview (truncated at 100 characters), and sent date.
2. WHEN the Admin_User applies search filters (keyword, user, date range), THE Admin_Panel SHALL send the corresponding query parameters to the Admin_API and update the message list without a full page reload.
3. WHEN the Admin_API receives a GET request to `/api/admin/messages` with filter parameters, THE Admin_API SHALL return only messages matching all provided filters, paginated at 50 per page.
4. WHEN the Admin_User confirms deletion of a single message, THE Admin_API SHALL delete that message and return HTTP 200.
5. WHEN the Admin_User selects multiple messages and confirms bulk deletion, THE Admin_API SHALL delete all selected messages in a single request and return HTTP 200 with the count of deleted messages.
6. THE Admin_Panel SHALL display a confirmation dialog before executing any message deletion.

---

### Requirement 8: Moderation — Reports

**User Story:** As an Admin_User, I want to view and resolve user reports, so that I can address community conduct issues efficiently.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Moderation section, THE Admin_Panel SHALL display a list of all Reports showing: reporter name, reported user name, reason, details (truncated), submission date, and current status (pending / resolved).
2. WHEN the Admin_User resolves a Report, THE Admin_API SHALL set the Report's `status` to "resolved" and return HTTP 200.
3. THE Admin_Panel SHALL visually distinguish pending Reports from resolved Reports using color-coded status badges.
4. THE Admin_Panel SHALL display the count of pending Reports in the navigation sidebar as a badge indicator.

---

### Requirement 9: Moderation — Warnings and Suspensions

**User Story:** As an Admin_User, I want to send warnings and apply suspensions to users, so that I can enforce community guidelines with proportionate actions.

#### Acceptance Criteria

1. WHEN the Admin_User sends a warning to a user, THE Admin_API SHALL increment that user's `warning_count` by 1, create a system message delivered to the user, and return HTTP 200 with the updated `warning_count`.
2. WHEN the Admin_User suspends a user for a specific duration (1 day, 1 week, or permanent), THE Admin_API SHALL set `suspended_until` to the appropriate future timestamp (or `null` for permanent suspension representation as a far-future date of 9999-12-31) and return HTTP 200.
3. WHEN the Admin_User removes a suspension from a user, THE Admin_API SHALL set `suspended_until` to `null` and return HTTP 200.
4. THE Admin_Panel SHALL display each user's `warning_count` and `suspended_until` date in the user detail view.
5. THE Admin_Panel SHALL offer a dropdown with predefined suspension durations: "1 day", "1 week", "Permanent" when the Admin_User initiates a suspension.

---

### Requirement 10: General Settings

**User Story:** As an Admin_User, I want to configure application-level settings, so that I can customise the platform's behaviour without modifying source code.

#### Acceptance Criteria

1. WHEN the Admin_User opens the Settings section, THE Admin_Panel SHALL load and display the current values for all settings keys: `ai_prompt`, `mail_host`, `mail_port`, `mail_username`, `banned_words`, and `welcome_message`.
2. WHEN the Admin_User submits the Settings form, THE Admin_API SHALL persist each key-value pair using upsert logic on the `settings` table and return HTTP 200.
3. WHEN the Admin_User adds or removes words in the Banned Words field, THE Admin_Panel SHALL provide a tag-input control showing each word as a removable chip and storing them as a comma-separated string.
4. WHEN a new Message is created and its body contains a word matching an entry in `banned_words`, THE Message model SHALL replace that word with asterisks before persisting (this behaviour already exists and SHALL be preserved).
5. WHEN the Admin_User updates the `ai_prompt` setting, THE Admin_Panel SHALL display a multi-line text area with a character counter.

---

### Requirement 11: Modern UI Design System

**User Story:** As an Admin_User, I want a clean, professional back-office interface with consistent icons and design tokens, so that I can navigate and operate the admin panel efficiently.

#### Acceptance Criteria

1. THE Admin_Panel SHALL use a sidebar navigation layout with icon-labelled menu items for: Dashboard, Users, Conversations, Messages, Moderation, and Settings.
2. THE Admin_Panel SHALL use a dedicated icon library (such as Heroicons or Lucide React) for all interactive controls, navigation items, and status indicators; emojis SHALL NOT be used as functional UI elements.
3. THE Admin_Panel SHALL apply a consistent color palette using Tailwind CSS utility classes, with a dark sidebar and a light main content area.
4. THE Admin_Panel SHALL be responsive and SHALL remain usable on viewport widths down to 1024px (desktop/tablet landscape).
5. WHEN any Admin_API call is in progress, THE Admin_Panel SHALL display a skeleton loading state or spinner in the affected section.
6. WHEN an Admin_API call fails, THE Admin_Panel SHALL display a toast notification with the error message and a dismiss action.
7. WHEN an Admin_API call succeeds for a create, update, or delete action, THE Admin_Panel SHALL display a toast notification confirming the action.
