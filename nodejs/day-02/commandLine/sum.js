const [pathNode, PathJsFile, ...restArgs] = process.argv;
console.log(restArgs.reduce((acc, num) => acc + Number(num), 0)); // 10`
