import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import assert from "node:assert/strict";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(path) {
  const compiledModule = { exports: {} };
  const js = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(js, {
    module: compiledModule,
    exports: compiledModule.exports,
    process,
    URL,
    Date,
    require: (name) =>
      name === "@/lib/job-fields"
        ? load("src/lib/job-fields.ts")
        : require(name),
  });
  return compiledModule.exports;
}
const { safeUrl, expired, jsonLd } = load("src/lib/portal.ts");
assert.equal(safeUrl("javascript:alert(1)"), null);
assert.equal(safeUrl("data:text/html,x"), null);
assert.equal(safeUrl("https://example.com/apply"), "https://example.com/apply");
assert.equal(expired({ deadline_at: null }), false);
assert.equal(expired({ deadline_at: "2000-01-01T00:00:00Z" }), true);
assert.equal(expired({ deadline_at: "2099-01-01T00:00:00Z" }), false);
assert.equal(jsonLd({ value: "</script>" }).includes("<"), false);
const { jobPostSchema } = load("src/lib/schemas/job-post.ts");
const base = {
  title: "Software intern",
  company: "Employer",
  description: "Original summary",
  category: "internship",
  status: "draft",
};
assert.equal(jobPostSchema.safeParse(base).success, true);
assert.equal(
  jobPostSchema.safeParse({ ...base, apply_url: "javascript:alert(1)" })
    .success,
  false,
);
assert.equal(
  jobPostSchema.safeParse({ ...base, company_logo: "data:image/svg+xml,x" })
    .success,
  false,
);
assert.equal(
  jobPostSchema.safeParse({ ...base, category: "apprenticeship" }).success,
  true,
);
console.log("11 portal validation and security assertions passed.");
