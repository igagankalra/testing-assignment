module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'src/support/world.ts',
      'src/support/hooks.ts',
      'src/steps/**/*.steps.ts'
    ],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    failFast: false,
    order: 'defined'
  }
}
