#!/usr/bin/env bash

# download file
curl https://eve-static-data-export.s3-eu-west-1.amazonaws.com/tranquility/sde.zip --output sde.zip

# unzip file
unzip sde.zip
rm sde.zip

