module.exports = {
  extends: "bamboo",
  rules: {
	"linebreak-style": 0,
	"@typescript-eslint/ban-ts-ignore": 0
  },
  parserOptions: {
    project: "./tsconfig.json"
  }
};
