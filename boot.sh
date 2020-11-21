#!/bin/bash

isLive=$(which ubiquity)

if [ -z $isLive ]; then
   # is installed

   if [ -e ".branch" ]
   then
      if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
         git checkout "$(<.branch)"
         rm .branch
      fi
   fi

   changed=0
   git remote update && git status -uno | grep -q 'Your branch is behind' && changed=1
   if [ $changed = 1 ]; then
      cd updateInstaller
      npm start&
      cd ..
      mv Backend/SERVER/API/SYSTEM/SETTINGS/USER/SETTINGS.json /tmp/SETTINGS.json
      git checkout .
      git pull
      mv /tmp/SETTINGS.json Backend/SERVER/API/SYSTEM/SETTINGS/USER/SETTINGS.json
      cd Backend/SERVER/API/SYSTEM/SETTINGS/USER/
      php updateSettings.php
      cd ../../../../../../
      ./updateInstaller/postUpdate.sh
      cd Frontend
      npm install
      cd ..
      killall electron
      sleep 1
   fi


   if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
      Xaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f1)
      Yaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f2)
      wget https://picsum.photos/${Xaxis}/${Yaxis} -q -O ./Backend/SERVER/Wallpapers/Images/onlineImage.jpg
   fi

   cd Backend
   ./startBackend.sh&
   cd ..
   cd Frontend
   npm run electron&
   sleep 1
   npm start&
   cd Backend
   cd SERVER
   cd API
   cd APPS
   php updateApps.php
   sleep 10m
   while [ true ]
   do
      php updateApps.php
      sleep 30m
   done
else
   ubiquity
fi