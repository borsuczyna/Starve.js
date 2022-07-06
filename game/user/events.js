var events = {};

function addEvent(name = '', callback = function() {} , priority = 0) {
    if (!(name in events)) {
        events[name] = [];
    }

    events[name].push({
        callback,
        priority
    });
}

function removeEvent(name, callback) {
    if (name in events) {
        for(var i = 0; i < events[name].length; i++) {
            if(events[name][i].callback == callback) {
                events[name].splice(i, 1);
                return;
            }
        }
    }
}

function triggerEvent(name, ...args) {
    if(!(name in events)) return;
    
    events[name].sort((a, b) => {
        return b.priority - a.priority;
    });
    
    for(var i = 0; i < events[name].length; i++) {
        events[name][i].callback(...args);
    }
}