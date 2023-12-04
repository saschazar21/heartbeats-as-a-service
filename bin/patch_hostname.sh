#!/usr/bin/env sh

PUBLIC_SCRIPTS_DIR="$(pwd)/public/scripts"

if [[ -z $CF_PAGES_URL ]]; then
  echo "CF_PAGES_URL is unset. Exiting..."
  exit 1
fi

find $PUBLIC_SCRIPTS_DIR -type f -name "*.sh" -exec sed -i "s|HOSTNAME=http://localhost:8788|HOSTNAME=${CF_PAGES_URL}|g" {} \;