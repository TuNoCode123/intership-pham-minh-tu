import readline from "readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
async function main() {
  const name = await rl.question("Bạn tên gì? ");
  console.log(`Hello  ${name}`);
  rl.close();
}
main();
