const majorVersion = Number(process.versions.node.split(".")[0]);
const requiredMajor = 18;

if (majorVersion !== requiredMajor) {
  console.error(
    `Node ${requiredMajor}.x is required for this project. Detected ${process.version}.`
  );
  console.error(
    "Use Volta to pin this repo: volta pin node@18.20.8 (or switch via your version manager)."
  );
  process.exit(1);
}
