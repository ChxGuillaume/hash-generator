var fs = require("fs");
var sha256 = require("sha256");

var nPasswordPerSize = 1000;
var nMinPasswordSize = 4;
var nPasswordSize = 250;

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
            
            var hashed_password = sha256(password);
            GenericFile += password + " : " + hashed_password;
            HashsFile += sha256(password);

            GenericFile += "\n";
            HashsFile += "\n";
        }
    }

    fs.writeFile(EType.GenericName, GenericFile, (err) => {
        if (err) throw err;
        console.log(EType.GenericName + " finished !");
    });

    fs.writeFile(EType.HashsName, HashsFile, (err) => {
        if (err) throw err;
        console.log(EType.HashsName + " finished !");
    });
});