function getRGB(str) {
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
        red: match[1],
        green: match[2],
        blue: match[3]
    } : {};
}

function calculateColorStep(steps) {
    var startingColor = getRGB("rgb(88, 175, 218)"); //same as buff color in css
    var targetColor = getRGB("rgb(255, 255, 255)"); //white for now

    var nr = (targetColor.red - startingColor.red);
    var ng = (targetColor.green - startingColor.green);
    var nb = (targetColor.blue - startingColor.blue);

    return {
        "red": nr / steps,
        "green": ng / steps,
        "blue": nb / steps
    };
}

function layoutPattern(pattern) {
    var $rows = $($("tr.lane-foot").get().reverse());
    var patternLength = parseInt(pattern.reverse[0].startf);
    var colorStep = calculateColorStep(patternLength);

    //forward passes
    for (var p = 0; p < pattern.forward.length; p++) {
        var xstart = parseInt(pattern.forward[p].start) - 1;
        var xend = 39 - parseInt(pattern.forward[p].stop);
        var loads = parseInt(pattern.forward[p].loads);
        var ystart = Math.floor(parseFloat(pattern.forward[p].startf));
        var yend = Math.floor(parseFloat(pattern.forward[p].end));

        for (var i = ystart; i < yend; i++) {
            var $row = $rows.eq(i);
            $row.children().each(function (x, element) {
                var posx = parseInt(element.getAttribute("posx"));
                if ((posx >= xstart && posx <= xend) && loads > 0) {
                    element.className += " forward";
                }
            });
        }
    }

    //reverse passes
    for (var p = 0; p < pattern.reverse.length; p++) {
        var xstart = parseInt(pattern.reverse[p].start) - 1;
        var xend = 39 - parseInt(pattern.reverse[p].stop);
        var loads = parseInt(pattern.reverse[p].loads);
        var ystart = Math.floor(parseFloat(pattern.reverse[p].startf));
        var yend = Math.floor(parseFloat(pattern.reverse[p].end));

        for (var i = ystart; i >= yend; i--) {
            var $row = $rows.eq(i);
            $row.children().each(function (x, element) {
                var posx = parseInt(element.getAttribute("posx"));
                if ((posx >= xstart && posx <= xend) && (loads > 0 || p == pattern.reverse.length - 1)) {
                    element.className += " reverse";
                }
            });
        }
    }

    //buff pass
    for (var i = 0; i < patternLength; i++) {
        if (i > 0) {
            var $previousRow = $rows.eq(i - 1);
        }

        var $row = $rows.eq(i);
        $row.children().each(function (x, element) {
            var $element = $(element);
            var posx = parseInt($element.attr("posx"));
            if ((posx > 0 && posx < 38) && !($element.hasClass("forward") || $element.hasClass("reverse"))) {
                element.className += " buff";

                if (i > 0) {
                    var prevGradientCount = parseInt($previousRow.children().eq(x).attr("gradient"));
                    $element.attr("gradient", prevGradientCount + 1);
                    //set color gradient
                    $element.attr("style", "background-color: rgb(" +
                        (88 + (colorStep.red * prevGradientCount + 1)) + ", " +
                        (175 + (colorStep.green * prevGradientCount + 1)) + ", " +
                        (218 + (colorStep.blue * prevGradientCount + 1)) + ");");
                }
            }
        });
    }
}