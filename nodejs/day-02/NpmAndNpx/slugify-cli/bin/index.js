#!/usr/bin/env node

import slugify from "../lib/slugify.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: slugify-cli <string>");
  process.exit(1);
}

const input = args.join(" ");
const slug = slugify(input);
console.log(slug);
