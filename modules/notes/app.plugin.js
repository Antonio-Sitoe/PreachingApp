const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * O expo-build-properties (android.kotlinVersion) só muda a stdlib; o kotlin-gradle-plugin em
 * android/build.gradle vem sem versão e cairia no 2.1 do RN. Aqui fixa-se o compilador na mesma
 * versão, que vem do app.config.js.
 */
module.exports = function withNotesEditor(config, { kotlinVersion }) {
  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin(:[^'"]*)?['"]\)/,
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')`
    );
    return config;
  });
};
