#!/bin/bash

isLive=$(which ubiquity)

if [ -z $isLive ]; then
   # is installed
   cd Backend
   ./startBackend.sh&
   cd ..
   if [ -e ".branch" ]
   then
      if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
         git checkout "$(<.branch)"
         rm .branch
      fi
   fi

   if ping -q -c 1 -W 1 8.8.8.8 >/dev/null; then
      cd updateInstaller
      npm start&
      cd ..
      git stash
      if ! git pull
      then
         git update-index --assume-unchanged Backend/SERVER/API/SYSTEM/SETTINGS/USER/SETTINGS.json
         git pull
      fi
      cd Backend/SERVER/API/SYSTEM/SETTINGS/USER/
      php updateSettings.php
      cd ../../../../../../
      ./updateInstaller/postUpdate.sh
      git stash pop
      killall electron
   fi

   Xaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f1)
   Yaxis=$(xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f2)
   wget https://picsum.photos/${Xaxis}/${Yaxis} -q -O ./Backend/SERVER/Wallpapers/Images/onlineImage.jpg

   cd Frontend
   npm install
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
