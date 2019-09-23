function getRGB(str) {
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
        red: match[1],
        green: match[2],
        blue: match[3]
    } : {};
}

function calculateColorStep(steps) {
    var nr = (targetColor.red - startingColor.red);
    var ng = (targetColor.green - startingColor.green);
    var nb = (targetColor.blue - startingColor.blue);

    return {
        "red": nr / steps,
        "green": ng / steps,
        "blue": nb / steps
    };
}