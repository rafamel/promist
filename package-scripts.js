const path = require('path');
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (...x) => `(${x.join(') && (')})`;
const dir = (file) => path.join(CONFIG_DIR, file);

const OUT_DIR = 'build';
const DOCS_DIR = 'docs';
const CONFIG_DIR = __dirname;
const EXT = '.js,.mjs,.jsx,.ts,.tsx';

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: series(
    'nps validate',
    exit0(`shx rm -r ${OUT_DIR}`),
    `shx mkdir ${OUT_DIR}`,
    `jake fixpackage["${OUT_DIR}"]`,
    `babel src --out-dir ${OUT_DIR} --extensions "${EXT}" --source-maps inline`,
    `shx cp -r typings "${OUT_DIR}/"`,
    'nps docs'
  ),
  publish: `nps build && cd ${OUT_DIR} && npm publish`,
  watch: `onchange "./src/**/*{${EXT}}" --initial --kill -- nps private.watch`,
  fix: [
    'prettier',
    `--write "./**/*{${EXT},json,scss}"`,
    `--config "${dir('.prettierrc.js')}"`,
    `--ignore-path "${dir('.prettierignore')}"`
  ].join(' '),
  lint: {
    default: [
      'concurrently',
      `"eslint ./src --ext ${EXT} -c ${dir('.eslintrc.js')}"`,
      `"tslint ./typings/**/*.{ts,tsx} -c ${dir('tslint.json')}"`,
      `"tsc --noEmit"`,
      '-n eslint,tslint,tsc',
      '-c yellow,blue,magenta'
    ].join(' '),
    test: `eslint ./test --ext .js,.mjs -c ${dir('.eslintrc.js')}`,
    md: `markdownlint *.md --config ${dir('markdown.json')}`,
    scripts: 'jake lintscripts[' + __dirname + ']'
  },
  test: {
    default: series('nps lint.test', 'jest ./test/.*.test.js'),
    watch: `onchange "./{test,src}/**/*{${EXT}}" --initial --kill -- nps private.test_watch`
  },
  validate:
    'nps lint lint.test lint.md lint.scripts test private.validate_last',
  update: series('npm update --save/save-dev', 'npm outdated'),
  clean: series(
    exit0(`shx rm -r ${OUT_DIR} ${DOCS_DIR} coverage`),
    'shx rm -rf node_modules'
  ),
  docs: series(
    exit0(`shx rm -r ${DOCS_DIR}`),
    `typedoc --out ${DOCS_DIR} ./typings`
  ),
  // Private
  private: {
    watch: series(
      'jake clear',
      [
        'concurrently',
        `"babel src --out-dir ${OUT_DIR} --extensions "${EXT}" --source-maps inline"`,
        '"nps lint"',
        '-n babel,+',
        '-c green,grey'
      ].join(' ')
    ),
    test_watch: series('jake clear', 'nps test'),
    validate_last: `npm outdated || jake countdown`
  }
});
