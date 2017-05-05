# Habibi CLI
**This project is in the initial stage of development. Many of the documented functions below are not yet implemented.**

Habibi is a system that enables teams of developers to share and manage environment variables in a simple and secure way.

Habibi CLI is a command line tool which is used to connect to Habibi and manage your environments.

## Commands
```sh
# Account management
habibi signup
habibi signin
# habibi signout

# Create a new project and adds the current user as project admin.
habibi init

# Create a new environment in the current project and add the local .env file to it. Requires project admin privileges.
habibi add <environment-name>

# Retrieve an environment and store it in the local .env file. For users with only one environment in the current project it's optional to provide this command with an environment-name.
habibi pull [<environment-name>]

# Update an environment based on the contents of the local .env file. For users with only one environment in the current project it's optional to provide this command with an environment-name. Requires write access to the environment.
habibi push [<environment-name>]

# Share an environment with another user. Requires project admin privileges.
habibi share <environment-name> <email>

# Remove access for another user. Requires project admin privileges.
# habibi unshare <environment-name> <email>

# List all users and environments in the current project. Requires project admin privileges.
# habibi list users
# habibi list [--all-projects]

# Dump all environments in the current project to files. Requires read access to the environments.
# habibi dump [--out-dir <directory-name>]
```
