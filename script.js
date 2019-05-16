document.addEventListener('DOMContentLoaded', function () {
    // Set current TZ info
    moment.tz.setDefault(moment.tz.guess());

    // Initial data
    var times = [
        ["Europe/London", "London"],
        ["America/New_York", "New York"],
        ["America/Los_Angeles", "San Francisco"],
    ], idCounter = 0;

    // Create a new section
    function createSection(data) {
        var section = document.createElement("section");
        section.setAttribute("id", "times-" + idCounter.toString());
        idCounter++;
        section.setAttribute("data-tz", data[0]);
        section.setAttribute("data-label", data[1]);
        document.body.appendChild(section);
        return section;
    }

    // Build initial sections from data
    for (var i = 0; i < times.length; i++) {
        createSection(times[i]);
    }

    setInterval(function () {
        // Detect all sections
        var sections = document.querySelectorAll("section[data-tz]");

        // Loop over all sections
        for (var i = 0; i < sections.length; i++) {
            var elm = sections[i];

            // Set the label
            var h1 = elm.querySelector("h1");
            if (!h1) {
                h1 = document.createElement("h1");
                elm.appendChild(h1);
            }
            h1.textContent = elm.getAttribute("data-label");

            // Do time
            var theMoment = moment().tz(elm.getAttribute("data-tz"));
            var h2 = elm.querySelector("h2");
            if (!h2) {
                h2 = document.createElement("h2");
                elm.appendChild(h2);
            }

            // Set the time
            var span = h2.querySelector("span");
            if (!span) {
                span = document.createElement("span");
                h2.appendChild(span);
            }
            span.textContent = theMoment.format("hh:mm:ss a");

            // Set the tz
            var small = h2.querySelector("small");
            if (!small) {
                small = document.createElement("small");
                h2.appendChild(small);
            }
            small.textContent = " (" + theMoment.format("z Z") + ")";

            // Set the date
            var h3 = elm.querySelector("h3");
            if (!h3) {
                h3 = document.createElement("h3");
                elm.appendChild(h3);
            }
            h3.textContent = theMoment.format("dddd Do MMMM");

            // Do snooze/awake
            var format = "HH:mm:ss",
                time = moment(theMoment.format(format), format),
                beforeTime = moment('08:00:00', format),
                afterTime = moment('22:00:00', format);
            if (time.isBetween(beforeTime, afterTime)) {
                elm.classList.add("awake");
                elm.classList.remove("asleep");
            } else {
                elm.classList.add("asleep");
                elm.classList.remove("awake");
            }
        }
    }, 100);
});
