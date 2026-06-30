#!/usr/bin/env bash
set -euxo pipefail


magick -size 3000x1333 canvas:none -fill none -stroke white \
  -draw 'line 0,0 0,1333' \
  -draw 'line 83,0 83,1333' \
  -draw 'line 167,0 167,1333' \
  -draw 'line 250,0 250,1333' \
  -draw 'line 333,0 333,1333' \
  -draw 'line 417,0 417,1333' \
  -draw 'line 500,0 500,1333' \
  -draw 'line 583,0 583,1333' \
  -draw 'line 667,0 667,1333' \
  -draw 'line 750,0 750,1333' \
  -draw 'line 833,0 833,1333' \
  -draw 'line 917,0 917,1333' \
  -draw 'line 1000,0 1000,1333' \
  -draw 'line 1083,0 1083,1333' \
  -draw 'line 1167,0 1167,1333' \
  -draw 'line 1250,0 1250,1333' \
  -draw 'line 1333,0 1333,1333' \
  -draw 'line 1417,0 1417,1333' \
  -draw 'line 1500,0 1500,1333' \
  -draw 'line 1583,0 1583,1333' \
  -draw 'line 1667,0 1667,1333' \
  -draw 'line 1750,0 1750,1333' \
  -draw 'line 1833,0 1833,1333' \
  -draw 'line 1917,0 1917,1333' \
  -draw 'line 2000,0 2000,1333' \
  -draw 'line 2083,0 2083,1333' \
  -draw 'line 2167,0 2167,1333' \
  -draw 'line 2250,0 2250,1333' \
  -draw 'line 2333,0 2333,1333' \
  -draw 'line 2417,0 2417,1333' \
  -draw 'line 2500,0 2500,1333' \
  -draw 'line 2583,0 2583,1333' \
  -draw 'line 2667,0 2667,1333' \
  -draw 'line 2750,0 2750,1333' \
  -draw 'line 2833,0 2833,1333' \
  -draw 'line 2917,0 2917,1333' \
  -draw 'line 0,83 3000,83' \
  -draw 'line 0,167 3000,167' \
  -draw 'line 0,250 3000,250' \
  -draw 'line 0,333 3000,333' \
  -draw 'line 0,417 3000,417' \
  -draw 'line 0,500 3000,500' \
  -draw 'line 0,583 3000,583' \
  -draw 'line 0,667 3000,667' \
  -draw 'line 0,750 3000,750' \
  -draw 'line 0,833 3000,833' \
  -draw 'line 0,916 3000,916' \
  -draw 'line 0,1000 3000,1000' \
  -draw 'line 0,1083 3000,1083' \
  -draw 'line 0,1166 3000,1166' \
  -draw 'line 0,1250 3000,1250' \
  overlay.png
