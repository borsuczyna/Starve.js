class Entity {
    constructor() {
        this.id = -1;
        this.maxhealth = 100;
        this.health = this.maxhealth;
        this.position = {x: 0, y: 0};
        this.type = 0;
        this.angle = 0;
        this.positionDifference = {x: 0, y: 0};
        this.angleDifference = 0;
    }

    setId(id) {
        if (typeof this.id !== 'number') return
        if (id < 0) return;

        this.id = id;
    }
}