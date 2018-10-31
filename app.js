var fs = require("fs");
var readline = require("readline");
var colors = require("colors");
var shajs = require('sha.js');
var md5 = require('md5.js');

var HashFuncList = {
    "md5": md5,
    "sha1": shajs,
    "sha224": shajs,
    "sha256": shajs,
    "sha384": shajs,
    "sha512": shajs,
};
var selectedHashFunc = {
    "name": "sha256",
    "func": HashFuncList.sha256
};

var rl = readline.createInterface(process.stdin, process.stdout, null);
var nPasswordPerSize = 10;
var nMinPasswordSize = 4;
var nPasswordSize = 25;

if (process.argv[2] === "--default" || process.argv[2] === "-d") startGeneration();
else hashFuncQuestion();

function hashFuncQuestion() {
    console.log("\n");

    var ListAlgos = "";
    Object.keys(HashFuncList).forEach(e => {
        ListAlgos += "- " + e.yellow + "\n";
    });

    rl.question("Choose a Hash Algorithm: ".blue + "(default sha256) \n".yellow + ListAlgos, (answer) => {
        if (Object.keys(HashFuncList).indexOf(answer) === -1) console.log("Invalid Hash Algorithm, keeping default one. ".magenta + "(sha256) ".yellow);
        else {
            selectedHashFunc.name = answer;
            selectedHashFunc.func = HashFuncList[answer];
            console.log("The Hash Algorithm is now: ".green + answer.yellow);
        }

        nPasswordPerSizeQuestion();
    });
}

function nPasswordPerSizeQuestion() {
    console.log("\n");
    rl.question("Number of Passwords per Size ? ".blue + "(default 10) ".yellow, (answer) => {
        var number = new Number(answer);

        if (isNaN(number) || answer === "" || number <= 0) console.log("The number of Password don't change. ".magenta + "(10) ".yellow);
        else {
            nPasswordPerSize = number;
            console.log("The number of Password per Size is now: ".green + number.toString().yellow);
        }

        nMinPasswordSizeQuestion();
    });
}

function nMinPasswordSizeQuestion() {
    console.log("\n");
    rl.question("Minimum Passwords Size ? ".blue + "(default 4) ".yellow, (answer) => {
        var number = new Number(answer);

        if (isNaN(number) || answer === "" || number <= 0) console.log("The Minimum Passwords size don't change. ".magenta + "(4) ".yellow);
        else {
            nMinPasswordSize = number;
            console.log("The Minimum Passwords size is now: ".green + number.toString().yellow);
        }

        nPasswordSizeQuestion();
    });
}

function nPasswordSizeQuestion() {
    console.log("\n");
    rl.question("Maximum Passwords Size ? ".blue + "(default 25) ".yellow, (answer) => {
        var number = new Number(answer);

        if (isNaN(number) || answer === "" || number <= 0) console.log("The Maximum Passwords size don't change. ".magenta + "(25) ".yellow);
        else {
            nPasswordSize = number;
            console.log("The Maximum Passwords size is now: ".green + number.toString().yellow);
        }
        console.log("\n");

        startGeneration();
    });
}

function startGeneration() {
    rl.close();

    var CharType = {
        LOWCASE: "abcdefghijklmnopqrstuvwxyz",
        UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        NUMBER: "0123456789",
        SPECIALCHAR: "&é\"'(-è_çà)=°+^$ù*¨£%µ¤,;:!?./§<>²"
    }

    var GenerationTypes = {
        SimplePasswords: {
            GenericName: "passwords-simple.txt",
            HashsName: "hashs-simple.txt",
            UsedChars: CharType.LOWCASE + CharType.UPPERCASE
        },
        MediumPasswords: {
            GenericName: "passwords-medium.txt",
            HashsName: "hashs-medium.txt",
            UsedChars: CharType.LOWCASE + CharType.UPPERCASE + CharType.NUMBER
        },
        HarderPasswords: {
            GenericName: "passwords-harder.txt",
            HashsName: "hashs-harder.txt",
            UsedChars: CharType.LOWCASE + CharType.UPPERCASE + CharType.NUMBER + CharType.SPECIALCHAR
        },
    }

    Object.keys(GenerationTypes).forEach(ETypeName => {
        var EType = GenerationTypes[ETypeName];
        var GenericFile = "";
        var HashsFile = "";

        for (let i = nMinPasswordSize; i <= nPasswordSize; i++) {
            for (let j = 0; j < nPasswordPerSize; j++) {
                var password = "";
                for (let k = 0; k < i; k++) {
                    password += EType.UsedChars[Math.floor(Math.random() * EType.UsedChars.length)];
                }

                var hashed_password;
                if (selectedHashFunc.name === "md5") {
                    hashed_password = new md5().update(password).digest('hex')
                } else {
                    hashed_password = selectedHashFunc.func(selectedHashFunc.name).update(password).digest('hex')
                }

                GenericFile += password + " : " + hashed_password;
                HashsFile += hashed_password;

                GenericFile += "\n";
                HashsFile += "\n";
            }
        }

        fs.writeFile(EType.GenericName, GenericFile, (err) => {
            if (err) throw err;
            console.log(EType.GenericName + " finished !".green);
        });

        fs.writeFile(EType.HashsName, HashsFile, (err) => {
            if (err) throw err;
            console.log(EType.HashsName + " finished !".green);
        });
    });
}