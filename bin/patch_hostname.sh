#!/usr/bin/env bash

PUBLIC_SCRIPTS_DIR="$(pwd)/public/scripts"

# Replace the string in all bash scripts in the directory
find $PUBLIC_SCRIPTS_DIR -type f -name "*.sh" -exec sed -i "s/HOSTNAME=http:\/\/localhost:8788/HOSTNAME=$CF_PAGES_URL/g" {} \;