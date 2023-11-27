#!/usr/bin/env bash

NEOFETCH_VERSION=
NEOFETCH_URL=https://raw.githubusercontent.com/dylanaraps/neofetch/master/neofetch
NEOFETCH_LOCATION=/tmp/neofetch

KERNEL=
OS=
SYSTEM=

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
 SYSTEM="{}"
}

if [[ -z $DEVICE_ID ]]; then
  echo "Device ID is not set. Exiting..."
  exit 1
fi

source_neofetch

get_kernel_info
get_os_info

echo $KERNEL
echo $OS