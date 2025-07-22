#!/bin/bash

echo '| id | size     |'
echo '|----|----------|'
ls -l --block-size=1 output/planet-*.osm.pbf | awk '{
  size=$5;
  fname=$9;
  sub(/^.*planet-/, "", fname);
  sub(/\.osm\.pbf$/, "", fname);
  id = fname + 0;

  if (size >= 1073741824) {
    val = size / 1073741824;
    unit = "GB";
  } else {
    val = size / 1048576;
    unit = "MB";
  }

  size_str = sprintf("%.1f %s", val, unit);

  while (length(size_str) < 9) {
    size_str = size_str " ";
  }

  printf("| %02d | %s|\n", id, size_str);
}'

