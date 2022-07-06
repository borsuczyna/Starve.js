const { ENTITIES } = require('../shared/constants');

class Entity {
    constructor(gameServer, type = -1) {
        this.gameServer = gameServer;
        this.type = type;

        this.angle = 0;
        this.position = {
            x: 0,
            y: 0
        };

        this.health = 100;
        this.maxHealth = 100;
        
        this.id = -1;
        this.action = false;

        this.speed = 0;
    }

    setId(id) {
        if (typeof id !== 'number') return;
        if (id < 0) return;

        this.id = id;
    }

    setSpeed(speed) {
        if (typeof speed !== 'number') return;
        if (speed < 0) return;

        this.speed = speed;
    }

    setPosition(x, y) {
        if (typeof x !== 'number') return;
        if (typeof y !== 'number') return;

        this.position.x = x;
        this.position.y = y;
    }

    setAngle(angle) {
        if (typeof angle !== 'number') return;
        this.angle = angle;
    }
    
    dealDamage(value) {
        this.health -= value;
    }

    update(delta) {
        switch (this.type) {
            case ENTITIES.PLAYER: {
                
                break;
            }
        }
    }
}

module.exports = Entity;