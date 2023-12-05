#!/usr/bin/env bash

API_HOSTNAME=http://localhost:8788
API_ENDPOINT=$API_HOSTNAME/api/devices
DEVICE_ID=$DEVICE_ID

CLIENT_SCRIPT_URL=$API_HOSTNAME/scripts/client.sh
CLIENT_SCRIPT_LOCATION=~/.config/heartbeat.sh

register_device() {
  read -p "Enter location of device: " LOCATION
  DEVICE_ID=$(curl -fsSL -X POST -d "location=${LOCATION}" -H "Authorization: Bearer ${API_KEY}" -H "Content-Type: application/x-www-form-urlencoded" ${API_ENDPOINT}\?format=text 2> /dev/null)

  if [[ -z $DEVICE_ID ]]; then
    echo "Failed to fetch a new device ID. Exiting..."
    exit 1
  fi
}

create_script_file() {
  if [[ -z $DEVICE_ID ]]; then
    echo "No device ID present. Run register_device() first. Exiting..."
    exit 1
  fi

  cat << EOF > $CLIENT_SCRIPT_LOCATION
#!/usr/bin/env bash

# CAUTION! Auto-generated file!
# Do not change the following line, unless you know exactly what you are doing!
DEVICE_ID=${DEVICE_ID} bash -c "\$(curl -fsSL ${CLIENT_SCRIPT_URL})" 2> /dev/null
EOF

  chmod +x $CLIENT_SCRIPT_LOCATION
}

create_cronjob() {
  CRONJOB_REGEXP="bash\s-c\s${CLIENT_SCRIPT_LOCATION}"
  CRONJOB="*/15 * * * * bash -c ${CLIENT_SCRIPT_LOCATION} > /dev/null 2>&1"

  if (crontab -l | grep -v "$CRONJOB_REGEXP" | sed "/^$/d" ; echo "$CRONJOB") | crontab - ; then
    echo "Successfully created cronjob!"
  else
    echo "Failed to create cronjob. Exiting..."
    exit 1
  fi
}

echo "Adding device to Heartbeat API."
read -sp "Enter API key: " API_KEY
echo ""

if [[ ${#API_KEY} -lt 1 ]]; then
  echo "Missing API key. Exiting..."
  exit 1
fi

register_device
create_script_file
create_cronjob