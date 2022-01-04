# Config
The configuration system was designed to be modular and easy to modify without the need to modify the core structure. (As of v2.0.3, the config file is located on `core/libraries/config.json`, but will be moved out in a future update.)

The configuration file controls critical information within the bot, so it should be carefully verified to assert the validity of the information.

## Configuration Structure
As of v2.0.3, the Configuration Structure is:
```json
{
  "token": "BOT_TOKEN",
  "version": "BOT_VERSION",
  "client": {
    "id": "CLIENT_ID",
    "devServerID": "DEV_SERVER_ID",
    "presences": {
      "production": {
        "status": "PRESENCE_STATUS",
        "activities": [{
            "name": "ACTIVITY_NAME",
            "type": "ACTIVITY_TYPE",
            "url": "ACTIVITY_URL"
          }
        ]
      },
      "maintenance": {
        "status": "PRESENCE_STATUS",
        "activities": [{
          "name": "ACTIVITY_NAME",
          "type": "ACTIVITY_TYPE",
          "url": "ACTIVITY_URL"
        }]
      },
      "interval": "PRESENCE_INTERVAL"
    }
  },
  "messageCommands": {
    "prefix": "PREFIX"
  },
  "permissions": {
    "levels": {
      "LEVEL_NAME": 0
    },
    "roles": {
      "GUILD_ID": {
        "ROLE_ID": 0
      }
    },
    "users": {
      "USER_ID": 0
    },
    "owners": [],
    "developers": [],
    "overrides": {
      "roles": {},
      "users": {}
    }
  },
  "maintenance": false,
  "environment": "ENVIRONMENT"
}
```

Where:
  - `token`: The Bot's Discord Client Token.
  - `version`: The Bot's version.
  - `client`: Discord Client related configurations.
    - `id`: The Bot's Discord Client ID.
    - `devServerID`: The ID of the Discord Server used for Development <span style="color:lightblue">Only used if ***environment*** is not set to ***prod***</span>
    - `presences`: The Presence to be set for the bot. All presences have the following structure:
      ```json
        {
          "status": "PRESENCE_STATUS",
          "activities": [{
              "name": "ACTIVITY_NAME",
              "type": "ACTIVITY_TYPE",
              "url": "ACTIVITY_URL"
            }
          ]
        }
      ```
      - where:
        - `status`: The status for the presence.
        - `activities`: Collection of activities to be used.
          - `name`: The text to be shown on the activity.
          - `type`: The type of the activity. Needs to be one of the following: `PLAYING`, `STREAMING`, `LISTENING`, `WATCHING`, `COMPETING`
          - `url`: The url to be set on the activity. Set to `null` or an empty string, it won't show on the activity.

      - `production`: The presences to be used on `PRODUCTION` environment.
      - `maintenance`: The presences to be used during maintenance.
  - `messageCommands`: Configurations for Message Commands.
    - `prefix`: The prefix for the Message Commands.
  - `permissions`: Configurations for permissions
    - `levels`: The Permission Levels used on commands. This property is used to parse Permission Levels into it's corresponding label.
      - `LEVEL_NAME`: The Permission Level's name.
      - `value`: The Permission Level, as an integer. The higher the level, the higher the Permission.
    - `roles`: Permission Levels to be bound to certain roles using their IDs. Guild based.
      - `GUILD_ID`: The ID of the Guild where to apply the role permissions.
        - `ROLE_ID`: The ID of the Role to be bound.
        - `value`: The Permission Level, as an integer. The higher the level, the higher the Permission.
    - `users`: Permission Levels to be bound to certain users using their IDs.
      - `USER_ID`: The ID of the User to be bound.
      - `value`: The Permission Level, as an integer. The higher the level, the higher the Permission.
    - `owners`: List of User IDs who have the higher Permission Level (Automatically calculated).
    - `developers`: List of User IDs who have the second higher Permission Level (Automatically calculated).
    - `overrides`: Overrides for Permission Level attributions. `USERS` has higher priority than `ROLES`, so any override made to an User will override an override made to a role the user has.
      - `roles`: Follows the same structure as `permissions.roles`
      - `users`: Follows the same structure as `permissions.users`
  - `maintenance`: Control whenever the bot should run on maintenance mode.
  - `environment`: The Environment the bot currently runs on. When set to `prod`, Slash Commands will be global, and any `logger.debug` will be ignored. When set to `dev`, Slash Commands will be restricted to the Development Server defined on `client.devServerID`.