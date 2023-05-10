#!/usr/bin/env ts-node-script
import { parse } from "./lib/cli";

const banner = `     _  _  _          ___                      
  _ | |(_)| |_  __ _ / __| _ __  __ _  __  ___ 
 | || || ||  _|/ _\` |\\__ \\| '_ \\/ _\` |/ _|/ -_)
  \\__/ |_| \\__|\\__,_||___/| .__/\\__,_|\\__|\\___|
                          |_| SDE Utilities
`;

console.log(banner);

parse();
