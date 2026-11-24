import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const context = { globalThis: {} };
context.globalThis = context;
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/live-activity-core.js"), "utf8"), context);
const buildQueue = context.ImoChatLive.buildQueue;
const kenya = buildQueue("KE");
const other = buildQueue("OTHER");

assert(kenya[0].flag === "ke" && kenya[0].category === "registration", "Kenya detection leads with a Kenya registration");
assert(kenya[0].text.indexOf("from Kenya") !== -1, "registration names the country");
assert(other[0].flag !== "ke" || other[0].category === "registration", "other regions keep the prepared order");

const flags = ["ke", "ug", "tz", "ng", "gh", "cm", "zm", "za", "gb", "us"];
for (const code of flags) {
  assert(kenya.some((item) => item.flag === code), "missing flag " + code);
  assert(fs.existsSync(path.join(root, "assets/flags/" + code + ".svg")), "missing flag file " + code);
}

const categories = ["registration", "activation", "withdrawal"];
assert(categories.every((name) => kenya.some((item) => item.category === name)), "all three categories");
assert(kenya.some((item) => item.name === "James" && item.country === "Kenya"), "James is used with Kenya");
assert(kenya.some((item) => item.name === "Sarah" && item.country === "Uganda"), "Sarah is used with Uganda");

const withdrawals = kenya.filter((item) => item.category === "withdrawal");
assert(withdrawals.length > 0 && withdrawals.every((item) => item.label === "Withdrawal" && / just withdrawn$/.test(item.text) && !/Sample only|Demo|Not a verified/i.test(item.label + " " + item.text)), "withdrawals say just withdrawn");
assert(kenya.every((item, index) => index === 0 || item.flag !== kenya[index - 1].flag), "adjacent notices use different countries");
assert(new Set(kenya.map((item) => item.id)).size === kenya.length, "queue ids do not repeat inside one cycle");

const js = fs.readFileSync(path.join(root, "assets/imochat.js"), "utf8");
assert(js.includes("setInterval(play, 3000)"), "rotation interval should be 3 seconds");
assert(js.includes("buildQueue(profile().region, Math.random)"), "popup reuses the detected region and shuffles");
assert(!js.includes("live-activity.json"), "popup does not call an external activity file");
assert(js.includes("https://lipahub.com/register.php?ref=MartinKe"), "registration link stays intact");

const css = fs.readFileSync(path.join(root, "assets/imochat.css"), "utf8");
assert(css.includes("translateX(-16px)") && css.includes("live-activity-out"), "slide-in and fade-out");
assert(css.includes("pointer-events: none"), "popup must not block clicks");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("queue " + kenya.length + " notices, checks passed");
