#!/usr/bin/env bash

HOSTNAME=http://localhost:8788
API_ENDPOINT=$HOSTNAME/api/heartbeats
NEOFETCH_URL=https://raw.githubusercontent.com/dylanaraps/neofetch/master/neofetch
NEOFETCH_LOCATION=/tmp/neofetch

HEARTBEAT=
KERNEL=
OS=
SYSTEM=
SYSTEM_LOAD=
UPTIME=

source_neofetch() {
  if [[ ! -f $NEOFETCH_LOCATION ]]; then
    curl -fsSL $NEOFETCH_URL -o $NEOFETCH_LOCATION 2> /dev/null
  fi

  if [[ ! -f $NEOFETCH_LOCATION ]]; then
    echo "Failed to fetch latest Neofetch script. Exiting..."
    exit 1
  fi

  source $NEOFETCH_LOCATION >/dev/null 2>&1
}

get_system_load() {
  local load=
  case $os in
    "Mac OS X"|"macOS")
      load=$(sysctl -n vm.loadavg | awk '{print "["$2", "$3", "$4"]"}')
      ;;
    Linux|BSD)
      load=$(cat /proc/loadavg | awk '{print "["$1", "$2", "$3"]"}')
      ;;
  esac

  SYSTEM_LOAD=$load
}

get_uptime_in_seconds() {
  local uptime=
  case $os in
    "Mac OS X"|"macOS")
      ts_boot=$(sysctl -n kern.boottime | cut -d" " -f4 | cut -d"," -f1)
      ts_now=$(date +%s)
      uptime=$((ts_now-ts_boot))
      ;;
    Linux|BSD)
      uptime=$(awk '{print int($1)}' /proc/uptime)
      ;;
  esac

  UPTIME=$uptime
}

get_kernel_info() {
  KERNEL="{ \"id\": \"$(uname -a)\", \"arch\": \"${kernel_machine}\", \"name\": \"${kernel_name}\", \"version\": \"${kernel_version}\", \"hostname\": \"${HOSTNAME:-$(hostname)}\" }"
}

get_os_info() {
  OS="{ \"id\": \"${distro}\""

  if [[ "$kernel_name" == "Darwin" ]]; then
    OS="${OS}, \"name\": \"${codename}\", \"version:\": \"${osx_version}\", \"build\": \"${osx_build}\""
  elif [[ $NAME && $VERSION ]]; then
    OS="${OS}, \"name\": \"${NAME}\", \"version:\": \"${VERSION}\""
  else
    OS="${OS}, \"name\": \"unknown\", \"version:\": \"unknown\""
  fi

  OS="${OS} }"
}

get_system_info() {
  SYSTEM="{ \"id\": \"${DEVICE_ID}\", \"cpu\": \"${cpu}\", \"model_name\": \"${model}\""

  # TODO: add system serial to JSON object for Linux-based OS as well
  case $os in
    "Mac OS X"|"macOS")
      if [[ -x /usr/sbin/system_profiler ]]; then
        SYSTEM="${SYSTEM}, \"serial\": \"$(system_profiler SPHardwareDataType | awk '/Serial/ {print $4}')\""
      fi
  esac

  SYSTEM="${SYSTEM} }"
}

create_heartbeat() {
  HEARTBEAT="{ \"kernel\": ${KERNEL}, \"operating_system\": ${OS}, \"system\": ${SYSTEM}"
  HEARTBEAT="${HEARTBEAT}, \"load\": ${SYSTEM_LOAD}"
  HEARTBEAT="${HEARTBEAT}, \"uptime\": ${UPTIME}"
  HEARTBEAT="${HEARTBEAT} }"
}

upload_heartbeat() {
  if [[ -z $SYSTEM_LOAD || -z $UPTIME ]]; then
    echo "Unsupported system targeted, or critical heartbeat information missing. Exiting..."
    exit 1
  fi

  curl -fsSLX POST -H "Content-Type: application/json" -H "Authorization: Bearer $DEVICE_ID" -d $HEARTBEAT $API_ENDPOINT > /dev/null 2>&1
}

if [[ -z $DEVICE_ID ]]; then
  echo "Device ID is not set. Exiting..."
  exit 1
fi

if [[ -z $HOSTNAME ]]; then
  echo "Hostname is not set. Exiting..."
  exit 1
fi

source_neofetch

get_kernel_info
get_os_info
get_system_info
get_system_load
get_uptime_in_seconds

create_heartbeat
upload_heartbeat

echo $HEARTBEAT