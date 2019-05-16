document.addEventListener('DOMContentLoaded', function () {
    // Set current TZ info
    moment.tz.setDefault(moment.tz.guess());

    // Initial data
    var times = {
        0: ["Europe/London", "London"],
        1: ["America/New_York", "New York"],
        2: ["America/Los_Angeles", "San Francisco"],
    };

    // Attempt to fetch times data from cookie, write back
    var cookieData = Cookies.getJSON('times');
    if (cookieData) {
        times = cookieData;
    }
    Cookies.set('times', times, {expires: 3650});

    // Create a new section
    function createSection(id, data) {
        var section = document.createElement("section");
        section.setAttribute("id", "times-" + id);
        section.setAttribute("data-tz", data[0]);
        section.setAttribute("data-label", data[1]);
        document.querySelector("main").appendChild(section);
        return section;
    }

    // Build initial sections from data
    for (var key in times) {
        if (!times.hasOwnProperty(key)) continue;
        createSection(key, times[key])
    }

    setInterval(function () {
        // Detect all sections
        var sections = document.querySelectorAll("section[data-tz]");

        // Loop over all sections
        for (var i = 0; i < sections.length; i++) {
            // Get/create elements
            var elm = sections[i];
            var div = elm.querySelector("div");
            if (!div) {
                div = document.createElement("div");
                elm.appendChild(div);
            }
            var h1 = elm.querySelector("h1");
            if (!h1) {
                h1 = document.createElement("h1");
                elm.appendChild(h1);
            }
            var h2 = elm.querySelector("h2");
            if (!h2) {
                h2 = document.createElement("h2");
                elm.appendChild(h2);
            }
            var span = h2.querySelector("span");
            if (!span) {
                span = document.createElement("span");
                h2.appendChild(span);
            }
            var small = h2.querySelector("small");
            if (!small) {
                small = document.createElement("small");
                h2.appendChild(small);
            }
            var h3 = elm.querySelector("h3");
            if (!h3) {
                h3 = document.createElement("h3");
                elm.appendChild(h3);
            }

            // Set the label
            h1.textContent = elm.getAttribute("data-label");

            // Validate tz & generate moment
            var tz = elm.getAttribute("data-tz");
            if (moment.tz.zone(tz) === null) {
                elm.className = "error";
                span.textContent = "";
                small.textContent = "Timezone '" + tz + "' not found";
                h3.textContent = "";
                continue;
            }
            var theMoment = moment().tz(tz);

            // Set the time
            span.textContent = theMoment.format("hh:mm:ss a");

            // Set the tz
            small.textContent = " (" + theMoment.format("z Z") + ")";

            // Set the date
            h3.textContent = theMoment.format("dddd Do MMMM");

            // Do snooze/awake
            var format = "HH:mm:ss",
                time = moment(theMoment.format(format), format),
                beforeTime = moment('08:00:00', format),
                afterTime = moment('22:00:00', format);
            if (time.isBetween(beforeTime, afterTime)) {
                elm.className = "awake";
            } else {
                elm.className = "asleep";
            }
        }
    }, 100);
});
