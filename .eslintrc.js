/* This configuration is mostly useful with editor integration & plugins. (ex: VSCode ESLint & Prettier plugins).
 * But if you want to manually lint run "npm run lint". 
 * Later gonna consider using husky + git hooks to automatic code format when commits.
*/

module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off",
    "consistent-return": "off",
    "array-callback-return": "off",
    camelcase: "off",
    "prefer-promise-reject-errors": "off"
  }
};
