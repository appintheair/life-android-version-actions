const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// versionCode — A positive integer [...] -> https://developer.android.com/studio/publish/versioning
const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
// versionName — A string used as the version number shown to users [...] -> https://developer.android.com/studio/publish/versioning
const versionNameRegexPattern = /(versionName(?:\s|=)*)(.*)/;

try {
    const gradlePath = core.getInput('gradlePath');
    const versionCode = core.getInput('versionCode');
    const versionName = core.getInput('versionName');
    const incrementVersionCode = core.getInput('incrementVersionCode');
    console.log(`Gradle Path : ${gradlePath}`);
    console.log(`Version Code : ${versionCode}`);
    console.log(`Version Name : ${versionName}`);
    console.log(`Increment version code : ${incrementVersionCode}`);

    fs.readFile(gradlePath, 'utf8', function (err, data) {
        newGradle = data;

        if (incrementVersionCode)
            const lastVersionCodeStr = newGradle.match(versionCodeRegexPattern)[2];
            const newVersionCode = parseInt(lastVersionCodeStr) + 1;
            console.log(`lastVersionCode = ${lastVersionCodeStr}, newVersionCode = ${newVersionCode}`)
            newGradle = newGradle.replace(versionCodeRegexPattern, `$1${newVersionCode}`);

        if (versionCode.length > 0)
            newGradle = newGradle.replace(versionCodeRegexPattern, `$1${versionCode}`);

        if (versionName.length > 0)
            newGradle = newGradle.replace(versionNameRegexPattern, `$1\"${versionName}\"`);
        fs.writeFile(gradlePath, newGradle, function (err) {
            if (err) throw err;

            console.log(`Successfully override version code ${versionCode}`)
            if (versionName.length > 0)
                console.log(`Successfully override version code ${versionName}`)
            core.setOutput("result", `Done`);
        });
    });

} catch (error) {
    core.setFailed(error.message);
}
