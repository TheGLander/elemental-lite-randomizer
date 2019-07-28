function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomHex() {
    var hex = "#"
    for (var i = 0; i < 6; i++) {
        hex += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"][Math.round(Math.random() * 15)]
    }
    return hex
}

function randomizePack(pack, restoreLostCategories = false) {
    var toReturn = ""
    var packLines = pack.split(/\n/);
    var sanitizedPackLines = [];
    for (var i in packLines) {
        if (!(packLines[i].substr(0, 1) == "#" || packLines[i] == "" || /-/i.test(packLines[i]) || packLines[i].startsWith("Title="))) {
            sanitizedPackLines.push(packLines[i])
        }
    }
    var assignable = [];
    var assignableColor = [];
    var categoryCount = 0
    var startCount = 0
    for (var i in sanitizedPackLines) {
        //
        if (/[^{};()=+:_*!]()*\:()*(#[0-9A-F]{6})|(#[0-9A-F]{3})/i.test(sanitizedPackLines[i])) {
            categoryCount++
            assignable.push(sanitizedPackLines[i].trim().split(":")[0].trim())
            assignableColor.push(": " + sanitizedPackLines[i].trim().split(":")[1].trim())
        } else if (/^([^{};()=+:_*!])+( )*\(([^{};()=+:_*!])+\)$/i.test(sanitizedPackLines[i])) {
            startCount++
            assignable.push(sanitizedPackLines[i].trim().split("(")[0].trim())
            assignableColor.push("(" + sanitizedPackLines[i].trim().split("(")[1].trim())
        } else if (/^([^{};()=+:_*!])+( )*\+( )*([^{};()=+:_*!])+( )*=( )*([^{};()=+:_*!])+( )*\(([^{};()=+:_*!])+\)$/i.test(sanitizedPackLines[i])) {
            assignable.push(sanitizedPackLines[i].trim().split("+")[0].trim())
            assignable.push(sanitizedPackLines[i].trim().split("+")[1].split("=")[0].trim())
            assignable.push(sanitizedPackLines[i].trim().split("+")[1].split("=")[1].split("(")[0].trim())
            assignableColor.push("(" + sanitizedPackLines[i].trim().split("+")[1].split("=")[1].split("(")[1].trim())
        }
    }

    shuffleArray(assignable)
    var categories = []
    for (var i in (function () {
            for (var x in assignableColor) {
                if (/:/i.test(assignableColor)) {
                    categories.push(assignableColor.shift())
                } else {
                    break
                }
            }
            return categories
        })()) {}
    shuffleArray(assignableColor)
    shuffleArray(categories)
    var foundCategories = []
    var lostCategories = []
    for (var i = 0; i < categoryCount; i++) {
        foundCategories.push(assignable.shift())
        toReturn += foundCategories[i] + categories.shift() + "\n"
    }
    for (var i = 0; i < startCount; i++) {
        var curCategory = assignableColor.shift()
        toReturn += assignable.shift() + curCategory + "\n"
        if (!(foundCategories.includes(curCategory.slice(1, -1))) || !(lostCategories.includes(curCategory.slice(1, -1)))) {
            lostCategories.push(curCategory.slice(1, -1))
        }
    }
    for (var i in assignableColor) {
        toReturn += `${assignable.shift()} + ${assignable.shift()} = ${assignable.shift()}${assignableColor[i]}\n`
        if (!(foundCategories.includes(assignableColor[i].slice(1, -1))) || !(lostCategories.includes(assignableColor[i].slice(1, -1)))) {
            lostCategories.push(assignableColor[i].slice(1,-1))
        }
    }
    if (restoreLostCategories) {
        for (var i in lostCategories) {
            toReturn = `${lostCategories[i]}: ${randomHex()}\n` + toReturn
        }
    }
    return toReturn
}